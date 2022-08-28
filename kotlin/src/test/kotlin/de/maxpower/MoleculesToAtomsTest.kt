package de.maxpower

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.get
import strikt.assertions.isEmpty
import strikt.assertions.isEqualTo
import strikt.assertions.isNotEmpty
import java.lang.IllegalArgumentException

internal class MoleculesToAtomsTest {
    @Test
    fun `it should return an empty map`() {
        expectThat(getAtoms("")).isEmpty()
    }

    @Test
    fun `it should parse a single atom`() {
        expectThat(getAtoms("H")) {
            get("H") isEqualTo 1
        }
    }

    @Test
    fun `it should parse H2O`() {
        expectThat(getAtoms("H2O")) {
            get("H") isEqualTo 2
            get("O") isEqualTo 1
        }
    }

    @Test
    fun `it should parse nested molecule C(OH)2`() {
        expectThat(getAtoms("C(OH)2")) {
            get("C") isEqualTo 1
            get("O") isEqualTo 2
            get("H") isEqualTo 2
        }
    }

    @Test
    fun `it should parse multiple nested molecule Fremy Salt`() {
        expectThat(getAtoms("K4[ON(SO3)2]2")) {
            get("K") isEqualTo 4
            get("O") isEqualTo 14
            get("N") isEqualTo 2
            get("S") isEqualTo 4
        }
    }

    @Test
    fun `it should parse atoms with "long" names`() {
        expectThat(getAtoms("Mg")) {
            get("Mg") isEqualTo 1
        }
    }

    @Test
    fun `cw - timeout #1`() {
        expectThat(getAtoms("As2{Be4C5[BCo3(CO2)3]2}4Cu5"))
            .isNotEmpty()
    }

    @Test
    fun `it should throw when the molecule is invalid "pie"`() {
        expectThrows<IllegalArgumentException> {
            getAtoms("pie")
        }
        expectThrows<IllegalArgumentException> {
            getAtoms("Mgh")
        }
    }

    @Test
    fun `it should throw when molecule has wrong parenthesis`() {
        expectThrows<IllegalArgumentException> {
            getAtoms("Mg(OH")
        }
        expectThrows<IllegalArgumentException> {
            getAtoms("MgOH)2")
        }
        expectThrows<IllegalArgumentException> {
            getAtoms("Mg(OH]2")
        }
        expectThrows<IllegalArgumentException> {
            getAtoms("Au5(C2H5[OH)3Li]3")
        }
    }
}
