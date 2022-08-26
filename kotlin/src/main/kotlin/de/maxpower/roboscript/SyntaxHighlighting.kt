package de.maxpower.roboscript

fun highlight(code: String): String = code.replace("([RLF])\\1*|[0-9]*".toRegex()) { match ->
    if (match.value.isBlank()) ""
    else when (match.value.first()) {
        'R' -> "green"
        'L' -> "red"
        'F' -> "pink"
        else -> "orange"
    }.let { "<span style=\"color: $it\">${match.value}</span>" }
}