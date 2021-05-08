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
        <h2>Edit Spotify Playlist</h2>
    </header>
)