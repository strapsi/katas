type SelectFieldFn = (entity: any) => any;
type SelectJoinFn = (join: [any, any]) => any;
type SelectFn = SelectFieldFn | SelectJoinFn;
type GroupByFn = SelectFieldFn;
type WhereFn = (source: any) => boolean;
type HavingFn = WhereFn;
type OrderBy = (first: any, seconds: any) => number;
type DS = Array<any>;
type EmptyOr<T> = T | undefined;

// recursively group the value of groups
const groupDatasourceBy = (datasource: DS, groupByFns: GroupByFn[], index: number): any => {
    const groupByFn = groupByFns[index];
    const keys = [...(new Set(datasource.map(groupByFn)))];
    return keys.map(key => {
        const values = datasource.filter(main => groupByFn(main) === key);
        const hasNext = index + 1 <= groupByFns.length - 1;
        return [
            key,
            hasNext ? groupDatasourceBy(values, groupByFns, index + 1) : values
        ];
    });
};

const extractFilter = (filter: WhereFn | Array<WhereFn>): WhereFn => Array.isArray(filter) ? filter[0] : filter;

class Query {
    private selects = 0;
    private froms: number = 0;
    private datasources: [DS, EmptyOr<DS>] = [[], undefined];
    private selectFns?: EmptyOr<SelectFn> = undefined;
    private groupByFns: GroupByFn[] = [];
    private havingFns: HavingFn[] = [];
    private orderBys?: EmptyOr<OrderBy> = undefined;
    private whereFns: Array<WhereFn | Array<WhereFn>> = [];

    select(selectFn: EmptyOr<SelectFn> = undefined): Query {
        this.selects++;
        this.selectFns = selectFn;
        return this;
    }

    from(main: DS, join: EmptyOr<DS> = undefined): Query {
        this.datasources = [[...main], !!join ? [...join] : undefined];
        this.froms++;
        return this;
    }

    // [BDE && [BDE || BDE] && [BDE || BDE]]
    where(...whereFns: WhereFn[]): Query {
        if (whereFns.length > 1) this.whereFns.push([...whereFns]);
        else this.whereFns.push(whereFns[0]);
        return this;
    }

    groupBy(...groupByFn: GroupByFn[]): Query {
        this.groupByFns.push(...groupByFn);
        return this;
    }

    having(...havingFns: HavingFn[]): Query {
        this.havingFns.push(...havingFns);
        return this;
    }

    orderBy(orderBy: OrderBy): Query {
        this.orderBys = orderBy;
        return this;
    }

    execute(): any[] {
        if (this.selects > 1) throw Error('Duplicate SELECT');
        if (this.froms > 1) throw Error('Duplicate FROM');

        // handle JOIN without a WHERE filter. combine each element of each DS
        if (!!this.datasources[1] && this.whereFns.length === 0) {
            const joined = this.datasources[0].reduce((join, main) => {
                return [...join, ...this.datasources[1]!.reduce((innerJoin, second) => {
                    return [...innerJoin, [main, second]];
                }, [])];
            }, []);
            this.datasources = [joined, this.datasources[1]];
        }

        // WHERE (filter DS, when JOIN-DS is given it is a join condition
        this.whereFns.forEach((filter, index) => {
            if (!!this.datasources[1]) {
                // take each element from the main DS and find the matching element from the Join DS
                // 1 <-> 1 only
                if (index === 0)
                    this.datasources = this.datasources[0]!.reduce((sources: [DS, DS], ds: DS): [DS, DS] => {
                        const matching = this.datasources[1]!.find(joinDS => extractFilter(filter)([ds, joinDS]));
                        return [[...sources[0], ds], [...sources[1], matching]];
                    }, [[], []]);
                else
                    // WHERE filter after join
                    this.datasources = [
                        this.datasources[0].filter((it, index) => extractFilter(filter)([it, this.datasources[1]![index]])),
                        this.datasources[1]
                    ];
            } else {
                // combine multiple filters to OR
                if (Array.isArray(filter))
                    this.datasources[0] = filter.reduce<any[]>((result, orFilter) => {
                        return [...result, ...this.datasources[0].filter(orFilter)];
                    }, []);
                else
                    this.datasources[0] = this.datasources[0].filter(filter);
            }
        });

        // SELECT can either be a field access our a group-array access
        // if the query has no groupByFn it is a field access
        if (!!this.selectFns && this.groupByFns.length === 0)
            this.datasources = [
                this.datasources[0].map((main, index) => {
                    // in case of a join pass an array of both datasources, otherwise just pass the main one
                    return this.selectFns!(!!this.datasources[1] ? [main, this.datasources[1][index]] : main);
                }),
                this.datasources[1]
            ];

        // GROUP BY finds all unique keys of the collection and pairs them with an array of objects
        // that is matching the key
        // the datasource is in following form: DS = [ [KEY, [...]], [KEY, [...]] ]
        if (this.groupByFns.length > 0) {
            const grouped = groupDatasourceBy(this.datasources[0], this.groupByFns, 0);
            this.datasources = [grouped, this.datasources[1]];
        }

        // filter grouped results with having
        this.havingFns.forEach(havingFn => {
            this.datasources = [
                this.datasources[0].filter(havingFn),
                this.datasources[1]
            ];
        });

        // SELECT FROM a joined GROUP
        // the parameter for the select function is a JOIN array
        if (!!this.selectFns && this.groupByFns.length > 0)
            this.datasources = [
                this.datasources[0].map(this.selectFns),
                this.datasources[1]
            ];

        // ORDER BY
        if (!!this.orderBys) this.datasources[0].sort(this.orderBys!);

        return this.datasources[0];
    }
}

export const query = (): Query => new Query();
