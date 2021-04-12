import React from "react"
import { render, fireEvent } from "@testing-library/react"

import { Selected } from "../src/assets/svgs"

const nameToClass = (name: string) =>
    name[0].toLowerCase() +
    name.slice(1, name.length)
        .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

describe("Symbols are functional", () => {
    test("Selected symbol toggles when clicked", () => {
        render(<Selected />)

        const instance = document.querySelector(".symbol_"+nameToClass(Selected.name))
        expect(instance).toBeTruthy()
        expect(instance?.lastElementChild).toHaveAttribute("visibility", "hidden")
        fireEvent.click(instance!)
        expect(instance?.lastElementChild).toHaveAttribute("visibility", "visible")
    })
})
