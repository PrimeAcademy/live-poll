/* eslint-disable react/jsx-no-target-blank */
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ButtonLink({
    to,
    style,
    color = 'primary',
    variant = 'contained',
    children,
    external = false,
    ...props
}) {
    const LinkComponent = external
        ? (props) => (
            // eslint-disable-next-line jsx-a11y/anchor-has-content
            <a
                href={to}
                target="_blank"
                {...props}
            />
        )
        : (props) => (
            <Link
                to={to}
                {...props}
            />
        );

    return (
        <LinkComponent style={{ textDecoration: 'none' }}>
            <Button
                variant={variant}
                color={color}
                style={style}
                {...props}
            >
                {children}
            </Button>
        </LinkComponent>
    );
}

export default ButtonLink;
