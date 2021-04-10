import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import { Container, UseSelected } from "./svgs/index";

describe("Symbols are functional", () => {

    test("Selected symbol toggles when clicked", async () => {
        render(
            <div data-testid="container">
                <Container include={["Selected"]}/>
                <UseSelected />
            </div>
        );
    
        const instance = (await screen.findByTestId("container")).lastElementChild
        expect(instance).not.toBeNull()
        expect(instance).toHaveClass("symbol-selected")
        expect(instance).not.toHaveClass("active")
    
        fireEvent.click(instance!)
    
        expect(instance).toHaveClass("active")
    })

})