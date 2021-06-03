import React from 'react'
import { Story, Meta } from '@storybook/react'

import IndicatorSvg, { IndicatorSvgProps } from '../assets/IndicatorSvg'

export default {
    component: IndicatorSvg,
    title: 'StateSvg',
    argTypes: {
        state: {
            options: [
                'success',
                'error',
                'warn',
                'hamburger',
            ] as IndicatorSvgProps['state'][],
            control: { type: 'select' },
        },
    },
} as Meta

const Template: Story<IndicatorSvgProps> = args => (
    <IndicatorSvg {...args} size={128} />
)

export const Default = Template.bind({})
Default.args = {
    state: 'success',
    size: 128,
}
