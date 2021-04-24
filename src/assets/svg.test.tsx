import React from "react"
import { render } from "@testing-library/react"

import { ChevronRight, Selected, Xmark } from "./svgs"

const nameToClass = (name: string) =>
    name[0].toLowerCase() +
    name
        .slice(1, name.length)
        .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

describe("Symbols have the correct formatting", () => {
    test("Correct class format", () => {
        const check = <S extends (...args: any) => JSX.Element>(
            symbol: S,
            params: Parameters<S>
        ): void => {
            const { container } = render(symbol(params))
            expect(container.firstChild).toHaveClass(
                "symbol_" + nameToClass(symbol.name)
            ) 
        }
        check(ChevronRight, [])
        check(Selected, [{active: false}])
        check(Xmark, [])
    })
})