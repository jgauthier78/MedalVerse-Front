import { useState } from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";

export default function ClipboardCopy({ copyText }) {
    const [isCopied, setIsCopied] = useState(false);

    // This is the function we wrote earlier
    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = () => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(copyText)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="mt-4">
            <InputGroup >
                <FormControl id="galadr" type="text" value={copyText} readOnly />
                <Button variant="outline-secondary" onClick={handleCopyClick}>
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </Button>
            </InputGroup>
        </div>
    );
}