package de.maxpower

fun soManyPermutations(s: String): List<String> =
    s.flatMapIndexed { idx, c ->
        when (s.length) {
            1 -> listOf(s)
            else -> s.removeRange(idx, idx + 1).let(::soManyPermutations).map { c + it }
        }
    }.distinct()
