import React from "react";

import "./style.scss"

import ChervonRight from "./ChevronRight";
import Selected from "./Selected";
import Xmark from "./Xmark";

const SVGList: { [key in SVGKey]: JSX.Element } = {
    "ChervonRight": <ChervonRight key="symbol-chervon-right"/>,
    "Selected": <Selected key="symbol-selected"/>,
    "Xmark": <Xmark key="symbol-xmark"/>,
}
type SVGKey = 
    | "ChervonRight"
    | "Selected"
    | "Xmark"

interface SVGContainerProps<T extends SVGKey[]> {
    include: (T & RemoveArrayRepeats<T>) | []
}
export function Container<T extends SVGKey[]>(props: SVGContainerProps<T>) {
    return <svg xmlns="http://www.w3.org/2000/svg" display="none">
        {props.include.map((key: SVGKey) => SVGList[key])}
    </svg>
}

export function UseChervonRight() {
    return <div className="symbol-chevron_right">
        <svg><use href="#symbol-chevron_right"></use></svg>
    </div>
}

export class UseSelected extends React.Component<{}, {active: boolean}> {
    constructor(props: {}) {
        super(props)
        this.state = {
            active: false
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({ active: !this.state.active })
    }
    render() {
        return (
            <div
                className={this.state.active ? "symbol-selected active" : "symbol-selected"}
                onClick={this.handleClick}
            >
                <svg><use href="#symbol-selected"></use></svg>
            </div>
        );
    }
}

export function UseXmark() {
    return <div className="symbol-xmark">
        <svg><use href="#symbol-xmark"></use></svg>
    </div>
}