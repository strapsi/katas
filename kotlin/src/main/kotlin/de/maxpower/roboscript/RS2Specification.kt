package de.maxpower.roboscript

fun execute(code: String): String {
    val map = mutableMapOf(0 to mutableMapOf(0 to "*"))
    var dir = 0
    var row = 0
    var col = 0
    var parsed = code
    while (parsed.contains("\\d".toRegex())) {
        parsed = parsed.replace("[LFR]\\d+|\\([LFR]+\\d*\\)\\d+|\\([LFR0-9]+\\)(?!\\d)".toRegex()) {
            it.value.takeLastWhile(Char::isDigit).let { n ->
                it.value.take(it.value.length - n.length)
                    .removeSurrounding("(", ")")
                    .repeat(n.toIntOrNull() ?: 1)
            }
        }
    }
    parsed.forEach {
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