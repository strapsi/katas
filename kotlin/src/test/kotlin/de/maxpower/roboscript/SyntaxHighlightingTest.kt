package de.maxpower.roboscript

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull

internal class SyntaxHighlightingTest {

    @Test
    fun `it should return a string`() {
        expectThat(highlight("")) {
            isNotNull()
            isA<String>()
        }
    }

    @Test
    fun `it should wrap F in pink`() {
        expectThat(highlight("F")) isEqualTo "<span style=\"color: pink\">F</span>"
    }

    @Test
    fun `it shoul warp L, R, F and numbers`() {
        expectThat(highlight("F3RF5LF7")) isEqualTo "<span style=\"color: pink\">F</span><span style=\"color: orange\">3</span><span style=\"color: green\">R</span><span style=\"color: pink\">F</span><span style=\"color: orange\">5</span><span style=\"color: red\">L</span><span style=\"color: pink\">F</span><span style=\"color: orange\">7</span>"
    }

    @Test
    fun `it should wrap groups of same character (or type)`() {
        expectThat(highlight("FFFR345F2LL")) isEqualTo "<span style=\"color: pink\">FFF</span><span style=\"color: green\">R</span><span style=\"color: orange\">345</span><span style=\"color: pink\">F</span><span style=\"color: orange\">2</span><span style=\"color: red\">LL</span>"
    }
}