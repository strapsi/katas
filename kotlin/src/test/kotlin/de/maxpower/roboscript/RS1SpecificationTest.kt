package de.maxpower.roboscript

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import kotlin.math.exp

internal class RS1SpecificationTest {
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
}