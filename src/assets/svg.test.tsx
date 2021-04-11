import React from "react"
import { render, fireEvent } from "@testing-library/react"

import { Selected } from "./svgs"

describe("Symbols are functional", () => {

    test("Selected symbol toggles when clicked", () => {
        render(<Selected/>);
        const instance = document.querySelector(".symbol-selected")
        expect(instance).toBeTruthy()
        expect(instance?.lastElementChild).toHaveAttribute("visibility", "hidden")
        fireEvent.click(instance!)
        expect(instance?.lastElementChild).toHaveAttribute("visibility", "visible")
    })

})