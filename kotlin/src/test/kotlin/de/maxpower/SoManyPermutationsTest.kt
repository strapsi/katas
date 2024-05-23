package de.maxpower

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.containsExactlyInAnyOrder


internal class SoManyPermutationsTest {

    @Test
    fun `it should return the permutations for a single char string`() {
        expectThat(SoManyPermutations.singlePermutations("a")) containsExactlyInAnyOrder listOf("a")
    }

    @Test
    fun `it should return all permutations for a double char string`() {
        expectThat(SoManyPermutations.singlePermutations("ab")) containsExactlyInAnyOrder listOf("ab", "ba")
    }

    @Test
    fun `it should return all permutations for a triple char string`() {
        expectThat(SoManyPermutations.singlePermutations("abc")) containsExactlyInAnyOrder listOf(
            "abc",
            "acb",
            "bac",
            "bca",
            "cab",
            "cba"
        )
    }

    @Test
    fun `it should return all permutations for a quadruple char string`() {
        expectThat(SoManyPermutations.singlePermutations("aabb")) containsExactlyInAnyOrder listOf(
            "aabb", "abab", "abba", "baab", "baba", "bbaa"
        )
    }


}
