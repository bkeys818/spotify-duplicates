import React from "react";

import "./svgs.scss"

type CustomSVGProps = Omit<React.SVGProps<SVGSVGElement>, "xmlns" | "viewBox">
function customSVGTemplate(viewBox: string, name: string, props: CustomSVGProps) {
    const { className, ...otherProps} = props
    return {
        ...{
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: viewBox,
            className: `symbol_${name} ` + (className ?? "")
        },
        ...otherProps
    } as React.SVGProps<SVGSVGElement>
}


export const ChevronRight = (props: CustomSVGProps) => 
    <svg {...customSVGTemplate("0 0 14 14", "chevron_right", props)} >
        <title>symbol-chevron_right</title>
        <path d="m3,1l6,6l-6,6" fill="none" stroke="currentcolor" strokeWidth={props.strokeWidth ?? 2}/>
    </svg>

export class Selected extends React.Component<Omit<CustomSVGProps, "onClick">, {visible: boolean}> {
    constructor(props: Omit<CustomSVGProps, "onClick">) {
        super(props)
        this.state = {
            visible: false
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({ visible: !this.state.visible })
    }
    render() {
        return <svg {...customSVGTemplate("-5 -5 10 10", "selected", this.props)} onClick={this.handleClick}>
            <title>symbol-selected</title>
            <circle r="4.5" fill="none" stroke="currentcolor" strokeWidth={this.props.strokeWidth ?? 1}/>
            <circle r="2.75" visibility={this.state.visible ? "visible" : "hidden"}/>
        </svg>
    }
}

export const Xmark = (props: CustomSVGProps) => 
    <svg {...customSVGTemplate("0 0 14 14", "xmark", props)}>
        <title>symbol-x</title>
        <path d="m2,2 10,10m-10,0 10,-10"  fill="none" stroke="currentcolor" strokeWidth={props.strokeWidth ?? 2}/>
    </svg>