import {expect} from 'chai';
import {describe, it} from 'mocha';
import {query} from '../src/functional-sql';


describe('functional sql tests', () => {
        it('should do', () => {
            expect(query().execute()).to.deep.equal([]);
        });

        it('should not allow more than 1 select()', () => {
            expect(() => query().select().select().execute()).to.throw('Duplicate SELECT');
        });

        it('should dummy select', () => {
            expect(query().select().execute()).to.deep.equal([]);
        });

        it('should select from an array', () => {
            expect(query().select().from([1, 2, 3]).execute()).to.deep.equal([1, 2, 3]);
        });

        it('order should not matter', () => {
            expect(query().from([1, 2, 3]).select().execute()).to.deep.equal([1, 2, 3]);
        });

        it('only a single from() should be allowed', () => {
            expect(() => query().select().from([]).from([]).execute()).to.throw('Duplicate FROM');
        });

        it('should select a single field from an object ds', () => {
            const name = (person: any) => person.name;
            expect(query().select(name).from([{name: 'Hans', age: 13}, {name: 'Dieter', age: 23}]).execute())
                .to.deep.equal(['Hans', 'Dieter']);
        });

        it('should filter the query with where a clause', () => {
            const old = (person: any) => person.age > 18;
            expect(query().select().from([{name: 'Hans', age: 13}, {name: 'Dieter', age: 23}]).where(old).execute())
                .to.deep.equal([{name: 'Dieter', age: 23}]);
        });

        it('should apply fields and filters', () => {
            const name = (person: any) => person.name;
            const old = (person: any) => person.age > 18;
            expect(query().select(name).from([{name: 'Hans', age: 13}, {name: 'Dieter', age: 23}]).where(old).execute())
                .to.deep.equal(['Dieter']);

        });

        it('should group the ds', () => {
            const expected = [
                ['Hans', [{name: 'Hans', age: 13}]],
                ['Dieter', [{name: 'Dieter', age: 23}]]
            ];
            const name = (person: any) => person.name;
            const result =
                query()
                    .select()
                    .from([{name: 'Hans', age: 13}, {name: 'Dieter', age: 23}])
                    .groupBy(name)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should mix where and groupBy', () => {
            const expected = [
                ['Hans', [{name: 'Hans', age: 13}, {name: 'Hans', age: 18}]],
                ['Dieter', [{name: 'Dieter', age: 23}]]
            ];
            const name = (person: any) => person.name;
            const underThirty = (person: any): boolean => person.age < 30;
            const result =
                query()
                    .select()
                    .from([
                        {name: 'Hans', age: 13},
                        {name: 'Dieter', age: 23},
                        {name: 'Hans', age: 18},
                        {name: 'Herbert', age: 63}
                    ])
                    .groupBy(name)
                    .where(underThirty)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should select key from a group', () => {
            const expected = ['Hans', 'Dieter'];
            const nameGroup = (group: any[]) => group[0];
            const name = (person: any) => person.name;
            const underThirty = (person: any) => person.age < 30;
            const result =
                query()
                    .select(nameGroup)
                    .from([
                        {name: 'Hans', age: 13},
                        {name: 'Dieter', age: 23},
                        {name: 'Hans', age: 18},
                        {name: 'Herbert', age: 63}
                    ])
                    .groupBy(name)
                    .where(underThirty)
                    .execute();
            expect(result).to.deep.equal(expected);

        });


        it('should select value from a group', () => {
            const expected = [13, 23, 63];
            const nameGroup = (group: any[]) => group[1]?.[0]?.age;
            const name = (person: any) => person.name;
            const result =
                query()
                    .select(nameGroup)
                    .from([
                        {name: 'Hans', age: 13},
                        {name: 'Dieter', age: 23},
                        {name: 'Hans', age: 18},
                        {name: 'Herbert', age: 63}
                    ])
                    .groupBy(name)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should groupBy parity', () => {
            const expected = [['odd', [1, 3, 5, 7, 9]], ['even', [2, 4, 6, 8, 10]]];
            const parity = (num: any) => num % 2 === 0 ? 'even' : 'odd';
            const result =
                query()
                    .select()
                    .from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                    .groupBy(parity)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should join two datasources', () => {
            const boys = [{name: 'Hanse', beer: 'Nordbraeu'}, {name: 'Dietmar', beer: 'Auge'}];
            const beers = [{name: 'Auge', city: 'M'}, {name: 'Nordbraeu', city: 'IN'}];
            const boy = (join: any[]) => ({boy: join[0]?.name, beerCity: join[1]?.city});
            const beerJoin = (join: any[]) => join[0]?.beer === join[1]?.name;
            const expected = [{boy: 'Hanse', beerCity: 'IN'}, {boy: 'Dietmar', beerCity: 'M'}];
            const result =
                query()
                    .select(boy)
                    .from(boys, beers)
                    .where(beerJoin)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should order the result', () => {
            const expected = [{name: 'Fred', age: 24}, {name: 'Hans', age: 13}, {name: 'Alex', age: 7}];
            const orderByAge = (pers1: any, pers2: any) => pers2.age - pers1.age;
            const result =
                query()
                    .select()
                    .from([{name: 'Hans', age: 13}, {name: 'Fred', age: 24}, {name: 'Alex', age: 7}])
                    .orderBy(orderByAge)
                    .execute();
            expect(result).to.deep.equal(expected);
        });
        it('should do multilevel grouping', () => {
            const parity = (num: number): string => num % 2 === 0 ? 'even' : 'odd';
            const isPrime = (num: number): string => {
                if (Number.isNaN(parseInt(num.toString()))) throw Error(`nonono: ${num}`);
                if (num < 2) return 'divisible';
                let divisor = 2;
                for (; num % divisor !== 0; divisor++) ;
                return divisor === num ? 'prime' : 'divisible';
            };
            const expected = [['odd', [['divisible', [1, 9]], ['prime', [3, 5, 7]]]], ['even', [['prime', [2]], ['divisible', [4, 6, 8]]]]];
            const result =
                query()
                    .select()
                    .from([1, 2, 3, 4, 5, 6, 7, 8, 9])
                    .groupBy(parity, isPrime)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should grouped values with HAVING', () => {
            const odd = ([key, _]: [string, any[]]): boolean => key === 'odd';
            const parity = (num: number): string => num % 2 === 0 ? 'even' : 'odd';
            const expected = [['odd', [1, 3, 5, 7, 9]]];
            const result =
                query()
                    .select()
                    .from([1, 2, 3, 4, 5, 6, 7, 8, 9])
                    .groupBy(parity)
                    .having(odd)
                    .execute();
            expect(result).to.deep.equal(expected);
        });


        it('should combine multiple HAVING clauses', () => {
            const expected = [['IN', [{name: 'Hans', age: 13, city: 'IN'}, {
                name: 'Herbert',
                age: 56,
                city: 'IN'
            }]]];
            const city = (person: any): string => person.city;
            const isINorM = ([city, _]: [string, any[]]): boolean => city === 'IN' || city === 'M';
            const moreThanOne = ([_, persons]: [string, any[]]): boolean => persons.length > 1;
            const result =
                query()
                    .select()
                    .from([
                        {name: 'Hans', age: 13, city: 'IN'},
                        {name: 'Dieter', age: 23, city: 'M'},
                        {name: 'Herbert', age: 56, city: 'IN'},
                        {name: 'Annika', age: 33, city: 'B'},
                    ])
                    .groupBy(city)
                    .having(isINorM)
                    .having(moreThanOne)
                    .execute();
            expect(result).to.deep.equal(expected);
        });

        it('should combine multiple WHERE arguments with OR', () => {
            const small = (num: number): boolean => num < 3;
            const big = (num: number): boolean => num > 7;
            const result =
                query()
                    .select()
                    .from([1, 2, 3, 4, 5, 6, 7, 8, 9])
                    .where(small, big)
                    .execute();
            expect(result).to.deep.equal([1, 2, 8, 9]);
        });
    }
);

describe('function sql tests from codewars', () => {

    const persons = [
        {
            name: 'Peter',
            profession: 'teacher',
            age: 20,
            maritalStatus: 'married'
        },
        {
            name: 'Michael',
            profession: 'teacher',
            age: 50,
            maritalStatus: 'single'
        },
        {
            name: 'Peter',
            profession: 'teacher',
            age: 20,
            maritalStatus: 'married'
        },
        {
            name: 'Anna',
            profession: 'scientific',
            age: 20,
            maritalStatus: 'married'
        },
        {
            name: 'Rose',
            profession: 'scientific',
            age: 50,
            maritalStatus: 'married'
        },
        {
            name: 'Anna',
            profession: 'scientific',
            age: 20,
            maritalStatus: 'single'
        },
        {
            name: 'Anna',
            profession: 'politician',
            age: 50,
            maritalStatus: 'married'
        }
    ];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const teachers = [{
        teacherId: '1',
        teacherName: 'Peter'
    },
        {
            teacherId: '2',
            teacherName: 'Anna'
        }
    ];
    const students = [{
        studentName: 'Michael',
        tutor: '1'
    },
        {
            studentName: 'Rose',
            tutor: '2'
        }
    ];

    const profession = (person: any): string => person.profession;
    const name = (person: any): string => person.name;
    const age = (person: any): number => person.age;
    const maritalStatus = (person: any): number => person.maritalStatus;
    const isTeacher = (person: any): boolean => person.profession === 'teacher';
    const professionGroup = (group: any[]) => group[0];
    const professionCount = (group: any[]) => [group[0], group[1].length];
    const naturalCompare = (value1: any, value2: any) => {
        if (value1 < value2)
            return -1;
        else if (value1 > value2)
            return 1;
        else
            return 0;
    };

    const isEven = (number: number) => {
        return number % 2 === 0;
    };

    const parity = (number: number) => {
        return isEven(number) ? 'even' : 'odd';
    };

    const isPrime = (number: number) => {
        if (number < 2) {
            return false;
        }
        let divisor = 2;
        for (; number % divisor !== 0; divisor++) ;
        return divisor === number;
    };

    const prime = (number: number) => {
        return isPrime(number) ? 'prime' : 'divisible';
    };

    const odd = (group: any) => {
        return group[0] === 'odd';
    };

    const descendentCompare = (number1: number, number2: number) => {
        return number2 - number1;
    };

    const lessThan3 = (number: number) => {
        return number < 3;
    };

    const greaterThan4 = (number: number) => {
        return number > 4;
    };

    const teacherJoin = (join: any[]) => {
        return join[0].teacherId === join[1].tutor;
    };

    const student = (join: any[]) => {
        return {
            studentName: join[1].studentName,
            teacherName: join[0].teacherName
        };
    };
    const tutor1 = (join: any[]) => {
        return join[1].tutor === '1';
    };

    it('SELECT * FROM persons GROUPBY profession <- Bad in SQL but possible in JavaScript', () => {
        expect(query().select().from(persons).groupBy(profession).execute()).to.deep.equal([
            ['teacher', [{
                'name': 'Peter',
                'profession': 'teacher',
                'age': 20,
                'maritalStatus': 'married'
            }, {
                'name': 'Michael',
                'profession': 'teacher',
                'age': 50,
                'maritalStatus': 'single'
            }, {
                'name': 'Peter',
                'profession': 'teacher',
                'age': 20,
                'maritalStatus': 'married'
            }]],
            ['scientific', [{
                'name': 'Anna',
                'profession': 'scientific',
                'age': 20,
                'maritalStatus': 'married'
            }, {
                'name': 'Rose',
                'profession': 'scientific',
                'age': 50,
                'maritalStatus': 'married'
            }, {
                'name': 'Anna',
                'profession': 'scientific',
                'age': 20,
                'maritalStatus': 'single'
            }]],
            ['politician', [{
                'name': 'Anna',
                'profession': 'politician',
                'age': 50,
                'maritalStatus': 'married'
            }]]
        ]);

    });

    it('SELECT * FROM persons WHERE profession=\'teacher\' GROUPBY profession', () => {
        expect(query().select().from(persons).where(isTeacher).groupBy(profession).execute()).to.deep.equal([
            ['teacher', [{
                'name': 'Peter',
                'profession': 'teacher',
                'age': 20,
                'maritalStatus': 'married'
            }, {
                'name': 'Michael',
                'profession': 'teacher',
                'age': 50,
                'maritalStatus': 'single'
            }, {
                'name': 'Peter',
                'profession': 'teacher',
                'age': 20,
                'maritalStatus': 'married'
            }]]
        ]);
    });

    it('SELECT profession FROM persons GROUPBY profession', () => {
        expect(query().select(professionGroup).from(persons).groupBy(profession).execute()).to.deep.equal(['teacher', 'scientific', 'politician']);
    });

    it('SELECT * FROM persons WHERE profession=\'teacher\' GROUPBY profession, name', () => {
        expect(query().select().from(persons).groupBy(profession, name).execute()).to.deep.equal([
            ['teacher', [
                ['Peter', [{
                    'name': 'Peter',
                    'profession': 'teacher',
                    'age': 20,
                    'maritalStatus': 'married'
                }, {
                    'name': 'Peter',
                    'profession': 'teacher',
                    'age': 20,
                    'maritalStatus': 'married'
                }]],
                ['Michael', [{
                    'name': 'Michael',
                    'profession': 'teacher',
                    'age': 50,
                    'maritalStatus': 'single'
                }]]
            ]],
            ['scientific', [
                ['Anna', [{
                    'name': 'Anna',
                    'profession': 'scientific',
                    'age': 20,
                    'maritalStatus': 'married'
                }, {
                    'name': 'Anna',
                    'profession': 'scientific',
                    'age': 20,
                    'maritalStatus': 'single'
                }]],
                ['Rose', [{
                    'name': 'Rose',
                    'profession': 'scientific',
                    'age': 50,
                    'maritalStatus': 'married'
                }]]
            ]],
            ['politician', [
                ['Anna', [{
                    'name': 'Anna',
                    'profession': 'politician',
                    'age': 50,
                    'maritalStatus': 'married'
                }]]
            ]]
        ]);
    });

    it('SELECT profession, count(profession) FROM persons GROUPBY profession', () => {
        expect(query().select(professionCount).from(persons).groupBy(profession).execute()).to.deep.equal([
            ['teacher', 3],
            ['scientific', 3],
            ['politician', 1]
        ]);
    });

    it('SELECT profession, count(profession) FROM persons GROUPBY profession ORDER BY profession', () => {
        expect(query().select(professionCount).from(persons).groupBy(profession).orderBy(naturalCompare).execute()).to.deep.equal([
            ['politician', 1],
            ['scientific', 3],
            ['teacher', 3]
        ]);
    });

    it('SELECT * FROM persons WHERE profession=\'teacher\' GROUPBY profession, name, age', () => {
        expect(query().select().from(persons).groupBy(profession, name, age, maritalStatus).execute()).to.deep.equal([
            ['teacher', [
                ['Peter', [
                    [20, [
                        ['married', [{
                            'name': 'Peter',
                            'profession': 'teacher',
                            'age': 20,
                            'maritalStatus': 'married'
                        }, {
                            'name': 'Peter',
                            'profession': 'teacher',
                            'age': 20,
                            'maritalStatus': 'married'
                        }]]
                    ]]
                ]],
                ['Michael', [
                    [50, [
                        ['single', [{
                            'name': 'Michael',
                            'profession': 'teacher',
                            'age': 50,
                            'maritalStatus': 'single'
                        }]]
                    ]]
                ]]
            ]],
            ['scientific', [
                ['Anna', [
                    [20, [
                        ['married', [{
                            'name': 'Anna',
                            'profession': 'scientific',
                            'age': 20,
                            'maritalStatus': 'married'
                        }]],
                        ['single', [{
                            'name': 'Anna',
                            'profession': 'scientific',
                            'age': 20,
                            'maritalStatus': 'single'
                        }]]
                    ]]
                ]],
                ['Rose', [
                    [50, [
                        ['married', [{
                            'name': 'Rose',
                            'profession': 'scientific',
                            'age': 50,
                            'maritalStatus': 'married'
                        }]]
                    ]]
                ]]
            ]],
            ['politician', [
                ['Anna', [
                    [50, [
                        ['married', [{
                            'name': 'Anna',
                            'profession': 'politician',
                            'age': 50,
                            'maritalStatus': 'married'
                        }]]
                    ]]
                ]]
            ]]
        ]);
    });

    it('SELECT * FROM numbers', () => {
        expect(query().select().from(numbers).execute()).to.deep.equal(numbers);
    });

    it('SELECT * FROM numbers GROUP BY parity', () => {
        expect(query().select().from(numbers).groupBy(parity).execute()).to.deep.equal([
            ['odd', [1, 3, 5, 7, 9]],
            ['even', [2, 4, 6, 8]]
        ]);
    });

    it('SELECT * FROM numbers GROUP BY parity, isPrime', () => {
        expect(query().select().from(numbers).groupBy(parity, prime).execute()).to.deep.equal([
            ['odd', [
                ['divisible', [1, 9]],
                ['prime', [3, 5, 7]]
            ]],
            ['even', [
                ['prime', [2]],
                ['divisible', [4, 6, 8]]
            ]]
        ]);
    });

    it('SELECT * FROM numbers GROUP BY parity HAVING', () => {
        expect(query().select().from(numbers).groupBy(parity).having(odd).execute()).to.deep.equal([
            ['odd', [1, 3, 5, 7, 9]]
        ]);
    });

    it('SELECT * FROM numbers ORDER BY value DESC', () => {
        expect(query().select().from(numbers).orderBy(descendentCompare).execute()).to.deep.equal([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });

    it('SELECT * FROM number WHERE number < 3 OR number > 4', () => {
        expect(query().select().from(numbers).where(lessThan3, greaterThan4).execute()).to.deep.equal([1, 2, 5, 6, 7, 8, 9]);
    });

    it('Strange JOIN with multiple selects', () => {
        expect(query().select().from([1, 2], [4, 5]).execute()).to.deep.equal([
            [1, 4],
            [1, 5],
            [2, 4],
            [2, 5]
        ]);
    });

    it('SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor', () => {
        expect(query().select(student).from(teachers, students).where(teacherJoin).execute()).to.deep.equal([{
            'studentName': 'Michael',
            'teacherName': 'Peter'
        }, {
            'studentName': 'Rose',
            'teacherName': 'Anna'
        }]);
    });

    it('SELECT studentName, teacherName FROM teachers, students WHERE teachers.teacherId = students.tutor AND tutor = 1', () => {
        expect(query().select(student).from(teachers, students).where(teacherJoin).where(tutor1).execute()).to.deep.equal([{
            'studentName': 'Michael',
            'teacherName': 'Peter'
        }]);
    });

    it('Another Select', () => {
        expect(query().where(teacherJoin).select(student).where(tutor1).from(teachers, students).execute()).to.deep.equal([{
            'studentName': 'Michael',
            'teacherName': 'Peter'
        }]);
    });
});
