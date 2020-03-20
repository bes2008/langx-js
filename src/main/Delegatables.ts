export interface Delegatable<E> {
    getDelegate(): E;

    setDelegate(e: E): void;
}