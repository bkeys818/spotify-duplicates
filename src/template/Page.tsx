import React from 'react'

import '../style/PageTemplate.scss'

const PageTemplate = ({ children }: { children: React.ReactNode }) => (
    <div id="app-container">
        <Header />
        <main>
            {children}
        </main>
        <Footer />
    </div>
)
export default PageTemplate

const Footer = () => (
    <footer>
    </footer>
)

const Header = () => (
    <header>
    </header>
)