import React from "react";
import {
    Header,
    HeaderName,
    HeaderNavigation,
    HeaderGlobalBar,
    SkipToContent,
} from "carbon-components-react/lib/components/UIShell";

const AppHeader = () => (
    <Header aria-label="FAWSL Analytics Dashboard">
        <SkipToContent />
            <HeaderName href="/" prefix="FAWSL">
                Analytics Dashboard
            </HeaderName>
            <HeaderNavigation aria-label="Header">
            </HeaderNavigation>
        <HeaderGlobalBar />
    </Header>
);

export default AppHeader;