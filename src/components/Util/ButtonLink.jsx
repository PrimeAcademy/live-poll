import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ButtonLink({
    to,
    style,
    children,
}) {
    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <Button
                variant="contained"
                color="primary"
                style={style}
            >
                {children}
            </Button>
        </Link>
    );
}

export default ButtonLink;
