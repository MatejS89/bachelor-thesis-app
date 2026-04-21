export default function formatLocal(dateString: string) {
    if (!dateString) {
        return '';
    }

    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
