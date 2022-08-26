package de.maxpower.roboscript

fun execute(code: String): String {
    val map = mutableMapOf(0 to mutableMapOf(0 to "*"))
    var dir = 0
    var row = 0
    var col = 0
    code
        .replace("[LFR]\\d+".toRegex()) {
            it.value[0].toString().repeat(it.value.substringAfter(it.value[0]).toIntOrNull() ?: -1)
        }.forEach {
            when (it) {
                'L' -> dir -= 1
                'R' -> dir += 1
                'F' -> when (dir and 3) {
                    0 -> map.getOrPut(row, ::mutableMapOf)[++col] = "*"
                    1 -> map.getOrPut(++row, ::mutableMapOf)[col] = "*"
                    2 -> map.getOrPut(row, ::mutableMapOf)[--col] = "*"
                    else -> map.getOrPut(--row, ::mutableMapOf)[col] = "*"
                }
            }
        }
    return map.toSortedMap().let { sorted ->
        val range = sorted.values.flatMap(MutableMap<Int, String>::keys).sorted().let { it.first()..it.last() }
        sorted.values.joinToString("\r\n") { row -> range.joinToString("") { row[it] ?: " " } }
    }
}