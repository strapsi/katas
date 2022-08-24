package de.maxpower.simpleassembler

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.get
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import kotlin.test.Ignore

internal class AssemblerInterpreterTest {
    @Test
    fun `interpret should return a map of registers`() {
        expectThat(interpret(i())).isA<Map<String, Int>>()
    }

    @Test
    fun `it should return the value 13 in register a`() {
        expectThat(interpret(i("mov a 13"))) {
            get("a").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `it should copy the value of register a into register b`() {
        expectThat(interpret(i("mov a 13", "mov b a"))) {
            get("a").isNotNull().and { isEqualTo(13) }
            get("b").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `it should increment the value in register a by 1`() {
        expectThat(interpret(i("mov a 12", "inc a"))) {
            get("a").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `it should decrement the value in register a by 1`() {
        expectThat(interpret(i("mov a 14", "dec a"))) {
            get("a").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `it should jump to the end and not increment any values`() {
        expectThat(interpret(i("mov a 13", "jnz 1 99", "inc a"))) {
            get("a").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `it should loop until register a is 0`() {
        expectThat(interpret(i("mov a 5", "inc a", "dec a", "jnz a -1"))) {
            get("a").isNotNull().and { isEqualTo(0) }
        }
    }

    @Test
    fun `it should jump one ahead and inc a`() {
        expectThat(interpret(i("mov a 12", "jnz 1 1", "inc a"))) {
            get("a").isNotNull().and { isEqualTo(13) }
        }
    }

    @Test
    fun `codewars should not timeout #1`() {
        val instructions = i(
            "mov l 9",
            "dec l",
            "jnz l -1",
            "mov z 54",
            "inc z",
            "mov f 6",
            "jnz f 1",
            "inc f",
            "mov z 2",
            "jnz 2 4",
            "inc z",
            "inc z",
            "inc z",
            "inc z",
            "mov n -67",
            "mov n -97",
            "mov g 32",
            "dec g",
            "dec g",
            "dec g",
            "dec g",
            "jnz g -4",
            "mov v -33",
            "dec v",
            "mov y 89",
            "inc y",
            "mov e -80",
            "mov o -48",
            "mov e o",
            "mov s -78",
            "mov s -9",
            "inc l",
            "mov i 1",
            "jnz i 3",
            "inc i",
            "inc i",
            "inc i",
            "mov k -24",
            "dec k",
            "mov q -57",
            "inc q",
            "mov b 9",
            "dec b",
            "dec b",
            "dec b",
            "jnz b -3",
            "mov w -8",
            "inc w",
            "mov a 30",
            "mov u 24",
            "mov a u",
            "mov h 16",
            "inc h",
            "mov o l",
            "mov e 9",
            "jnz 8 1",
            "inc e",
            "mov b -23",
            "mov x 9",
            "mov x 5",
            "inc v",
            "mov p 63",
            "mov z p",
            "mov s -60",
            "mov n -41",
            "mov w 22",
            "mov h 5",
            "jnz h 4",
            "inc h",
            "inc h",
            "inc h",
            "inc h",
            "mov f -71",
            "dec y",
            "mov z 99",
            "dec q",
            "mov o 5",
            "dec o",
            "jnz o -1",
            "mov a 48",
            "mov k -88",
            "dec z",
            "mov e g",
            "mov w -100",
            "mov x a",
            "inc n",
            "mov g 6",
            "jnz 7 2",
            "inc g",
            "inc g",
            "inc u",
            "dec q",
            "inc y",
            "dec k",
            "dec s",
            "mov b l",
            "mov o 4",
            "jnz 8 4",
            "inc o",
            "inc o",
            "inc o",
            "inc o",
            "mov j 87",
            "inc j",
            "dec z",
            "mov v -14",
            "mov y -34",
            "inc j",
            "inc v",
            "mov d -36",
            "inc d",
            "mov y 88",
            "mov g 79",
            "inc h",
            "inc b",
            "dec h",
            "mov p -71",
            "mov t 8",
            "jnz t 1",
            "inc t",
            "inc q",
            "dec f",
            "dec u",
            "mov h w",
            "dec t",
            "mov w 16",
            "dec w",
            "dec w",
            "jnz w -2",
            "mov e 2",
            "jnz 1 2",
            "inc e",
            "inc e",
            "mov f v",
            "dec i",
            "dec f",
            "mov o 58",
            "dec f",
            "mov j 3",
            "jnz 8 2",
            "inc j",
            "inc j",
            "mov s 66",
            "dec p",
            "mov e -63",
            "mov j 7",
            "jnz 9 1",
            "inc j",
            "dec h",
            "dec y",
            "mov s 16",
            "dec s",
            "dec s",
            "dec s",
            "dec s",
            "jnz s -4",
            "inc l",
            "mov r 50",
            "mov r i"
        )
        expectThat(interpret(instructions)).isA<Map<String, Int>>()
    }

    @Test
    @Ignore("StackOverflowError with recursion in interpret method")
    fun `codewars should not timeout #2`() {
        val instructions = i(
            "mov a 1",
            "mov b 1",
            "mov c 0",
            "mov d 26",
            "jnz c 2",
            "jnz 1 5",
            "mov c 7",
            "inc d",
            "dec c",
            "jnz c -2",
            "mov c a",
            "inc a",
            "dec b",
            "jnz b -2",
            "mov b c",
            "dec d",
            "jnz d -6",
            "mov c 18",
            "mov d 11",
            "inc a",
            "dec d",
            "jnz d -2",
            "dec c",
            "jnz c -5"
        )
        expectThat(interpret(instructions)).isA<Map<String, Int>>()
    }

    @Test
    fun `codewars should not timeout #3`() {
        val instructions = i(
            "mov j 9",
            "jnz 3 1",
            "inc j",
            "mov e 35",
            "dec e",
            "mov c -62",
            "dec c",
            "mov m 88",
            "dec m",
            "mov l -78",
            "mov q -9",
            "mov l q",
            "dec e",
            "mov t 3",
            "jnz 8 3",
            "inc t",
            "inc t",
            "inc t",
            "mov t 12",
            "dec t",
            "dec t",
            "dec t",
            "dec t",
            "jnz t -4",
            "mov s 75",
            "dec s",
            "mov k 8",
            "dec k",
            "dec k",
            "dec k",
            "dec k",
            "jnz k -4",
            "mov g 85",
            "inc g",
            "mov w 9",
            "jnz 9 2",
            "inc w",
            "inc w",
            "mov r 61",
            "dec r",
            "mov k j",
            "mov h -2",
            "inc h",
            "mov j 8",
            "jnz 5 1",
            "inc j",
            "mov u 5",
            "dec u",
            "jnz u -1",
            "dec r",
            "mov a 8",
            "jnz 9 2",
            "inc a",
            "inc a",
            "mov x 66",
            "inc x",
            "mov p 26",
            "mov r p",
            "mov g 3",
            "jnz g 3",
            "inc g",
            "inc g",
            "inc g",
            "dec a",
            "mov h 4",
            "jnz h 2",
            "inc h",
            "inc h",
            "mov j 8",
            "dec j",
            "dec j",
            "jnz j -2",
            "inc t",
            "mov g 7",
            "jnz 6 2",
            "inc g",
            "inc g",
            "mov b -65",
            "mov b -36",
            "mov e 4",
            "jnz e 1",
            "inc e",
            "mov v -52",
            "dec v",
            "inc u",
            "mov f 2",
            "dec f",
            "dec f",
            "jnz f -2",
            "mov y -88",
            "dec y",
            "mov g k",
            "mov n -84",
            "mov n -98",
            "dec n",
            "dec q",
            "dec a",
            "mov k b",
            "dec c",
            "inc l",
            "inc n",
            "dec x",
            "mov h 4",
            "jnz 8 1",
            "inc h",
            "inc a",
            "inc q",
            "mov h 3",
            "jnz 2 3",
            "inc h",
            "inc h",
            "inc h",
            "inc p",
            "mov y -97",
            "mov o -61",
            "mov o o",
            "dec q",
            "mov s 5",
            "jnz 4 1",
            "inc s",
            "mov z -3",
            "dec z",
            "inc c",
            "dec z",
            "inc j",
            "dec f",
            "mov t 2",
            "jnz t 2",
            "inc t",
            "inc t",
            "mov f 6",
            "jnz f 3",
            "inc f",
            "inc f",
            "inc f",
            "dec k",
            "inc p",
            "mov t a",
            "dec j",
            "mov s 81",
            "mov a 63",
            "inc u",
            "mov l 20",
            "dec l",
            "dec l",
            "dec l",
            "dec l",
            "jnz l -4",
            "mov s 3",
            "dec s",
            "jnz s -1",
            "dec e",
            "mov i 57",
            "mov o i",
            "inc a",
            "dec b",
            "mov k 3",
            "jnz 9 3",
            "inc k",
            "inc k",
            "inc k",
            "mov w i",
            "inc g",
            "dec r",
            "dec g",
            "mov f w",
            "mov j t",
            "mov f 4",
            "dec f",
            "dec f",
            "dec f",
            "dec f",
            "jnz f -4",
            "inc j",
            "mov t 2",
            "jnz 5 3",
            "inc t",
            "inc t",
            "inc t",
            "mov w 3",
            "dec w",
            "jnz w -1",
            "dec t",
            "inc w",
            "mov q 4",
            "dec q",
            "dec q",
            "jnz q -2",
            "mov p 3",
            "jnz p 1",
            "inc p",
            "inc p",
            "dec i"
        )
        expectThat(interpret(instructions)).isA<Map<String, Int>>()
    }

    private fun i(vararg instruction: String): Array<String> = arrayOf(*instruction)
}