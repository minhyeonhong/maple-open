import React from 'react';

const Header = () => {
    const background_mode = (type) => {
        const bodyStyle = document.body.style;
        const theme = {
            color: type === 'light' ? '#000' : '#FFF',
            backgroundColor: type === 'light' ? '#FFF' : '#000',
            border : type === 'light' ? '1px solid #000' : '1px solid #FFF'
        };
        bodyStyle.color = theme.color;
        bodyStyle.backgroundColor = theme.backgroundColor;

    }

    return (
        <div>
            Header
            <div>
                <button onClick={() => background_mode('light')}>light</button>
                <button onClick={() => background_mode('dark')}>dark</button>
            </div>
        </div>
    );
};

export default Header;