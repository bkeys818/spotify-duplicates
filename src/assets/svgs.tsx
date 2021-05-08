import React, { useState } from "react"

import "../style/svgs.scss"

type SVGTemplateProps = Omit<React.SVGProps<SVGSVGElement>, "xmlns"> & {
    name: string
    viewBox: Required<React.SVGProps<SVGSVGElement>>["viewBox"]
}
function SVGTemplate(props: SVGTemplateProps) {
    let { name, className, children, ...otherProps } = props
    name = "symbol_" + name
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={name + (className ? ` ${className}` : "")}
            {...otherProps}
        >
            <title>{name}</title>
            {children}
        </svg>
    )
}



export const ChevronRight = () =>
    <SVGTemplate name="chevron-right" viewBox="0 0 14 14">
        <path d="m3,1l6,6l-6,6" strokeWidth="2" />
    </SVGTemplate>


interface SelectedProps {
    active: boolean
}
export const Selected = (props: SelectedProps) =>
    <SVGTemplate name="selected" viewBox="-5 -5 10 10">
        <circle r="2.75" visibility={props.active ? "visible" : "hidden"} />
        <circle r="4.5" fill="none" stroke="currentcolor"/>
    </SVGTemplate>


export const Xmark = () =>
    <SVGTemplate name="xmark" viewBox="0 0 14 14">
        <path d="m2,2 10,10m-10,0 10,-10" strokeWidth="2" />
    </SVGTemplate>


interface LoadStatusProps {
    dataState: "DEFAULT" | "ACTIVE" | "SUCCESS" | "ERROR"
}
const loadStatusPaths: { [key in Required<LoadStatusProps>["dataState"]]: [string, string] } = {
    DEFAULT: ["", ""],
    ACTIVE: [
        "M 60 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0",
        "M15,60a45,45,0,0,0,45,45",
    ],
    ERROR: ["m15,60 30,30", "m45 90 60,-60"],
    SUCCESS: ["m20,20 80,80", "m20,100 80,-80"],
}
export const LoadStatus = (props: LoadStatusProps) =>
    <SVGTemplate name="load-status" viewBox={"0, 0, 120, 120"}>
        <path d={loadStatusPaths[props.dataState][0]} />
        <path d={loadStatusPaths[props.dataState][1]} />
    </SVGTemplate>

