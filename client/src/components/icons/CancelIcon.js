function CancelIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-${props.size} w-${props.size} ${props.options} `} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

export default CancelIcon