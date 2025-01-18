type ContainerProps = {
    children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
    return <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">{children}</div>;
}

export default Container;