import { Button } from "./Button";

export const Default = () => <Button />;

export const WithoutMaskAndBlur = () => <Button mask={false} blur={false} />;

export const WithoutMask = () => <Button mask={false} />;

export const WithoutBlur = () => <Button blur={false} />;

export const Paused = () => <Button playing={false} />;
