package de.maxpower

import kotlin.random.Random


// COMMENT IN main function to run game of life in console
//fun main() {
//    gameOfLife { map, width ->
//        ProcessBuilder("bash", "-c", "clear").inheritIO().start().waitFor()
//        map
//            .chunked(width)
//            .map { it.joinToString("") { if (it) "O" else "." } }
//            .forEach(::println)
//        Thread.sleep(500)
//    }
//}

fun livingNeighbors(map: List<Boolean>, index: Int, width: Int): Int =
    listOf(index - width, index, index + width)
        .sumOf {
            if (it in map.indices)
                map.subList(
                    it - (it % width).coerceAtMost(1),
                    (it + (width - 1 - (it % width)).coerceAtMost(1)) + 1
                ).count { b -> b }
            else 0
        } - if (map[index]) 1 else 0

fun gameOfLife(
    width: Int = 50,
    height: Int = 24,
    generations: Int = 100,
    initialMap: List<Boolean> = emptyList(),
    cb: ((List<Boolean>, Int) -> Unit)? = null
): List<Boolean> =
    initialMap
        .ifEmpty { (1..(width * height)).map { Random.nextDouble() > .85 } }
        .let {
            var map = it
            repeat((1..generations).count()) {
                if (cb != null) cb(map, width)
                map = List(map.size) { index ->
                    when (livingNeighbors(map, index, width)) {
                        2 -> map[index]
                        3 -> true
                        else -> false
                    }
                }
            }
            map
        }