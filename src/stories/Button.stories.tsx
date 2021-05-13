import React from 'react'
import { Meta, Story } from '@storybook/react'
import { addons } from "@storybook/addon-essentials";
import Button, { ButtonProps } from "../components/Button";

export default {
    title: 'Button',
    component: Button,
    argTypes: {
        children: {
            name: "label",
        },
        color: {
            defaultValue: '#fff',
            control: "color",
        },
    }
} as Meta

const Template: Story<ButtonProps> = (args) => <Button {...args} />;


export const Default = Template.bind({});
Default.args = {
    children: 'Button'
}
