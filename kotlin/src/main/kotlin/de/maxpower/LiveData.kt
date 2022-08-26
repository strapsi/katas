package de.maxpower

class LiveData<T>(initial: T? = null) {
    var value: T? = initial
        set(value) {
            field = value
            lambdas.forEach { it(value!!) }
        }
    private val lambdas: MutableList<(T) -> Unit> = mutableListOf()
    fun observe(lambda: (newValue: T) -> Unit) { lambdas.add(lambda) }
}

fun <T> combineLatest(vararg sources: LiveData<out Any>, combiner: (Array<Any?>) -> T): LiveData<T> {
    val combineIfAllSet: (LiveData<T>) -> Unit = {
        if (sources.mapNotNull(LiveData<out Any>::value).size == sources.size)
            it.value = combiner(sources.map(LiveData<*>::value).toTypedArray())
    }
    return LiveData<T>(null).apply {
        sources.forEach { it.observe { combineIfAllSet(this) } }
        combineIfAllSet(this)
    }
}