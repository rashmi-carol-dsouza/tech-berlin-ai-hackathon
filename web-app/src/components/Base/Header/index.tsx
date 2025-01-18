import Container from '../Container';
import { useRefContext } from '../../../context/Ref';
import { useLocation } from '../../../context/Location';

function Header() {
    const { inputRef } = useRefContext();
    const { getCoordinates } = useLocation();
    const handleFocusInput = () => {
        inputRef?.current?.focus();
    };

    const handleFindNearbyClick = () => {
        getCoordinates();
    };

    return (
        <header className="border-b border-gray-200 bg-gray-50">
            <Container>
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Here & Now</h1>

                        <p className="mt-1.5 text-sm text-gray-500">
                            Discover popular, quaint, fun places, and experiences near you.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring"
                            type="button"
                            onClick={handleFindNearbyClick}
                        >
                            <span className="text-sm font-medium">Find what's nearby</span>
                        </button>

                        <button
                            className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                            type="button"
                            onClick={handleFocusInput}
                        >
                            Ask a question
                        </button>
                    </div>
                </div>
            </Container>
        </header>
    );
}

export default Header;