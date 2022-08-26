package de.maxpower.roboscript

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.isNotBlank
import kotlin.math.exp

internal class RS2SpecificationTest {
    @Test
    fun `it should return a string representation of the map`() {
        expectThat(execute("")).isA<String>()
    }

    @Test
    fun `it should return a 1x1 grid with a star if the robot does not move`() {
        expectThat(execute("")) isEqualTo "*"
    }

    @Test
    fun `it should move right 5 times`() {
        expectThat(execute("FFFFF")) isEqualTo "******"
    }

    @Test
    fun `it should go 2 steps up`() {
        expectThat(execute("LFF")) isEqualTo "*\r\n*\r\n*"
    }

    @Test
    fun `it should go right up right and down`() {
        expectThat(execute("FFLFFFRFFRFF"))
            .isEqualTo("  ***\r\n  * *\r\n  * *\r\n***  ")
    }

    @Test
    fun `it should build a box`() {
        expectThat(execute("FFFFFLFFFFFLFFFFFLFFFFFL"))
            .isEqualTo("******\r\n*    *\r\n*    *\r\n*    *\r\n*    *\r\n******")
    }

    @Test
    fun `it should overlap with itself`() {
        expectThat(execute("LFFFFFRFFFRFFFRFFFFFFF"))
            .isEqualTo("    ****\r\n    *  *\r\n    *  *\r\n********\r\n    *   \r\n    *   ")
    }

    @Test
    fun `it should overlap with itself but with the use fun 'functions'`() {
        expectThat(execute("LF5RF3RF3RF7"))
            .isEqualTo("    ****\r\n    *  *\r\n    *  *\r\n********\r\n    *   \r\n    *   ")
    }

    @Test
    fun `it should overlap with itself but with the use of useless parenthesis`() {
        expectThat(execute("(L(F5(RF3))(((R(F3R)F7))))"))
            .isEqualTo("    ****\r\n    *  *\r\n    *  *\r\n********\r\n    *   \r\n    *   ")
    }

    @Test
    fun `it should overlap with itself but with the use of parenthesis`() {
        expectThat(execute("LF5(RF3)2RF7"))
            .isEqualTo("    ****\r\n    *  *\r\n    *  *\r\n********\r\n    *   \r\n    *   ")
    }

    @Test
    fun `it should produce the same output for RS1 and RS2 code with different usage of parenthesis`() {
        expectThat(execute("F4LF4RF4RF4LF4LF4RF4RF4LF4LF4RF4RF4")) {
            isEqualTo(execute("F4L(F4RF4RF4LF4L)2F4RF4RF4"))
            isEqualTo(execute("F4L((F4R)2(F4L)2)2(F4R)2F4"))
        }
    }

    @Test
    fun `cw timeout #1`() {
        expectThat(execute("(LLRRL17L7R15R1)10(FR14F12FF12RLF6)12(RRR14F15FR)L11L16L9R13RRL10(F7RRR)F10FLRF4R1L18L13LLFL19L((FF9)LF5RLLRRRR8R10FL15F13)4R15R14L13LL((R)(L9R5R9LL11FF)F16F7FF15L10)13L2FLL16F10F15")) {
            isNotBlank()
        }
    }

    @Test
    fun `cw timeout #2`() {
        expectThat(execute("(LLRRL17L7R15R1)10(FR14F12FF12RLF6)12RRR14F15FRL11L16L9R13RRL10F7RRRF10FLRF4R1L18L13LLFL19L(FF9LF5RLLRRRR8R10FL15F13)4R15R14L13LL(RL9R5R9LL11FFF16F7FF15L10)13L2FLL16F10F15")) {
            isNotBlank()
        }
    }

    @Test
    fun `cw timeout #3()`() {
        expectThat(execute("LLRLR6F12FF15F9(R)6LFR2RF5L14FRFR15FRL4RL3F4FRLFRL4LL18R(L7RF12RL3R(F7R2RR10F)L16F18FFR11R6)F11RFLRF9LRR1LR9R4L12LF3FF5FF14L14R15L1RL4FFR10FF((RR11LFRF)1(R16RFLL9)5RF4FLLL)17(LR15LFFR9)L10F3F5L6F9(L2R)18LF17LL17F8F18RF16FFLFF15LL2(((L7F17FR18)7L3F10F14L14L)11)R9RFRRR8L12(((L1R)14F6L11RL5R14R4R5L16F12L1)LFL15FRRR10R18L((L1L2LRFR18)18)12)(FF10LF(FR19LLRR2F18FL14LL)3((F13LLR18RF3R3LF)7(L15F4F11LL19))LR12)14F5"))
            .isNotBlank()
    }
}