import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button,
} from '@material-ui/core';
import ButtonLink from './ButtonLink';

function ConfirmationDialog({
    open,
    title = 'Are you sure?',
    prompt = 'Are you sure?',
    confirmText = 'Confirm',
    confirmLinkTo = null,
    onConfirm = () => {},
    cancelText = 'Cancel',
    onClose = () => {},
}) {
    const ConfirmButton = confirmLinkTo
        ? (...props) => <ButtonLink to={confirmLinkTo} {...props} />
        : (...props) => <Button {...props} />;
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {prompt}
                </DialogContentText>
                <DialogActions>
                    <Button
                        color="default"
                        variant="contained"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <ConfirmButton
                        color="secondary"
                        variant="contained"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </ConfirmButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmationDialog;
