import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ButtonLink({
    to,
    style,
    color = 'primary',
    variant = 'contained',
    children,
}) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <Button
                variant={variant}
                color={color}
                style={style}
            >
                {children}
            </Button>
        </Link>
    );
}

export default ButtonLink;