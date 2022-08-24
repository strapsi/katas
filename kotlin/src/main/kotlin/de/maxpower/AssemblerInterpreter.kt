package de.maxpower.simpleassembler

fun value(param: String, registers: Map<String, Int>): Int = param.toIntOrNull() ?: registers[param] ?: -1
fun interpretInstruction(
    registers: MutableMap<String, Int>,
    pointer: Int,
    instructions: Array<String>
): Map<String, Int> = if (pointer < instructions.size)
    instructions[pointer].split(" ").let { params ->
        mutableMapOf<String, Int>().apply { plusAssign(registers) }.let {
            when (params.first()) {
                "mov" -> it[params[1]] = value(params[2], it)
                "inc" -> it[params[1]] = it[params[1]]?.plus(1) ?: -1
                "dec" -> it[params[1]] = it[params[1]]?.minus(1) ?: -1
                "jnz" -> if (value(params[1], it) != 0)
                    return interpretInstruction(it, pointer + value(params[2], it), instructions)
            }
            interpretInstruction(it, pointer + 1, instructions)
        }
    } else registers

fun interpret(instructions: Array<String>): Map<String, Int> = interpretInstruction(mutableMapOf(), 0, instructions)