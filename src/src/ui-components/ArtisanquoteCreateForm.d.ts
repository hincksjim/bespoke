/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ArtisanquoteCreateFormInputValues = {
    Amountquoted?: number;
};
export declare type ArtisanquoteCreateFormValidationValues = {
    Amountquoted?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ArtisanquoteCreateFormOverridesProps = {
    ArtisanquoteCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Amountquoted?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ArtisanquoteCreateFormProps = React.PropsWithChildren<{
    overrides?: ArtisanquoteCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ArtisanquoteCreateFormInputValues) => ArtisanquoteCreateFormInputValues;
    onSuccess?: (fields: ArtisanquoteCreateFormInputValues) => void;
    onError?: (fields: ArtisanquoteCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ArtisanquoteCreateFormInputValues) => ArtisanquoteCreateFormInputValues;
    onValidate?: ArtisanquoteCreateFormValidationValues;
} & React.CSSProperties>;
export default function ArtisanquoteCreateForm(props: ArtisanquoteCreateFormProps): React.ReactElement;
