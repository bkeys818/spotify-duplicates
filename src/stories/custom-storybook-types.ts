import { Meta as DefaultMeta, ArgTypes } from '@storybook/react'
import { OptionsConfig, OptionsControlType } from '@storybook/components'

type Dictionary = {
    [key: string]: any
    [key: number]: any
}

export type Meta<Args extends Dictionary> = DefaultMeta & {
    argTypes?: ArgTypes & Partial<{
        [key in keyof Args]: ArgTypes[string] & {
            control?: Partial<Omit<OptionsConfig, 'type'> & {
                type: OptionsControlType | 'none'
            }>,
            table?: {
                type?: {
                    /** A short version of the type */
                    summary: string
                    /** A long version of the type */
                    detail: string
                }
                defaultValue?: {
                    /** A short version of the default value */
                    summary: string
                    /** A long version of the default value */
                    detail: string
                }
                category?: string
                subcategory?: string
                disable?: boolean
            }
        }
    }>
}