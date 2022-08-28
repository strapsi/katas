package de.maxpower

fun getAtoms(molecule: String): Map<String, Int> {
    val parenMatches: (Char, Char) -> Boolean =
        { left, right -> molecule.count { it == left } == molecule.count { it == right } }
    if (molecule.contains("^[a-z].*|.*[a-z]{2,}.*|\\(.*\\[[^]].*\\)".toRegex())
        || !parenMatches('(', ')') || !parenMatches('[', ']') || !parenMatches('{', '}')
    ) throw IllegalArgumentException()
    var parsed = molecule
        .replace("[\\[{]".toRegex(), "(")
        .replace("[]}]".toRegex(), ")")
    while (parsed.contains("\\d".toRegex())) {
        parsed = parsed.replace("[A-Z][a-z]?\\d+|\\(([A-Z][a-z]?)*\\d*\\)\\d+".toRegex()) {
            it.value.takeLastWhile(Char::isDigit).let { n ->
                it.value.take(it.value.length - n.length)
                    .removeSurrounding("(", ")")
                    .repeat(n.toIntOrNull() ?: 1)
            }
        }
    }
    return parsed
        .replace("[()]".toRegex(), "")
        .split("(?=[A-Z])".toRegex())
        .filter(String::isNotBlank)
        .groupBy { it }
        .mapValues { it.value.size }
}
