package de.maxpower

import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.api.expectThat
import strikt.assertions.any
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo
import strikt.assertions.isTrue

internal class GameOfLifeTest {
    @Test
    fun `it should return the current population`() {
        expectThat(gameOfLife(10, 3, 0)).hasSize(3 * 10)
    }

    @Test
    fun `it should return at least some living cells`() {
        expectThat(gameOfLife()) { any { isTrue() } }
    }

    @Test
    fun `cell 0, 0 should survive`() {
        expectThat(
            gameOfLife(
                width = 3,
                height = 3,
                generations = 1,
                initialMap = listOf(true, false, false, true, true, false, false, false, false)
            )
        ).isEqualTo(listOf(true, true, false, true, true, false, false, false, false))
    }

    @Test
    fun `still life should be the same after many generations`() {
        val stillLife = listOf(
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true,
            false,
            false,
            false,
            true,
            false,
            false,
            true,
            false,
            false,
            false,
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        )
        expectThat(
            gameOfLife(
                width = 6,
                height = 5,
                generations = 500,
                initialMap = stillLife
            )
        ).isEqualTo(stillLife)
    }

    @Test
    fun `an oscillator should have two states`() {
        val stateOne = listOf(
            false, false, false, false, false,
            false, false, false, false, false,
            false, true, true, true, false,
            false, false, false, false, false,
            false, false, false, false, false
        )
        val stateTwo = listOf(
            false, false, false, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, false, true, false, false,
            false, false, false, false, false
        )
        expect {
            val gol = gameOfLife(width = 5, height = 5, generations = 100, initialMap = stateOne)
            that(gol).isEqualTo(stateOne)
            that(gameOfLife(width = 5, height = 5, generations = 1, initialMap = gol)).isEqualTo(stateTwo)
        }
    }
}