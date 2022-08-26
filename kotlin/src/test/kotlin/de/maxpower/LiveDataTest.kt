package de.maxpower

import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.*

internal class LiveDataTest {
    @Test
    fun `it should be initialized`() {
        expectThat(LiveData<Int>()) {
            isNotNull()
            isA<LiveData<Int>>()
        }
    }

    @Test
    fun `it should have a value property`() {
        expectThat(LiveData<Int>().value).isNull()
    }

    @Test
    fun `the value should be initialized with a constructor param`() {
        expectThat(LiveData(13).value) isEqualTo 13
    }

    @Test
    fun `it should change the value`() {
        val ld = LiveData(12)
        ld.value = ld.value!! + 1
        expectThat(ld.value) isEqualTo 13
    }

    @Test
    fun `changes should be observable`() {
        val ld = LiveData(12)
        var newValue: Int? = null
        ld.observe { newValue = it }
        expectThat(newValue).isNull()

        ld.value = ld.value!! + 1
        expectThat(newValue) isEqualTo 13
    }

    @Test
    fun `it should combine LiveData until the last one has a value`() {
        val firstName = LiveData<String>()
        val lastName = LiveData<String>()
        val fullName = combineLatest(firstName, lastName) { (s1, s2) ->
            "${s1 as String} ${s2 as String}"
        }
        expectThat(fullName.value).isNull()
        firstName.value = "Max"
        expectThat(fullName.value).isNull()
        lastName.value = "Power"
        expectThat(fullName.value) isEqualTo "Max Power"
        firstName.value = "Strapsi"
        expectThat(fullName.value) isEqualTo "Strapsi Power"
    }

    @Test
    fun `it should combine LiveData instantly if all params have values`() {
        val fullName = combineLatest(LiveData("Max"), LiveData("Power")) { (s1, s2) ->
            "${s1 as String} ${s2 as String}"
        }
        expectThat(fullName.value) isEqualTo "Max Power"
    }

    @Test
    fun `it should accept multiple observers`() {
        val firstName = LiveData<String>()
        var observed1 = false
        var observed2 = false
        firstName.observe { observed1 = true }
        firstName.observe { observed2 = true }
        firstName.value = "Max"
        expectThat(observed1 && observed2).isTrue()
        expectThat(firstName.value) isEqualTo "Max"
    }
}