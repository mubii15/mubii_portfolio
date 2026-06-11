import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = title ? `${title} | Mubarak Ismail Studio` : 'Mubarak Ismail | Studio';
    }, [title]);
}
