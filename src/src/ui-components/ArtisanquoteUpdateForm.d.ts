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
export declare type ArtisanquoteUpdateFormInputValues = {
    Amountquoted?: number;
};
export declare type ArtisanquoteUpdateFormValidationValues = {
    Amountquoted?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ArtisanquoteUpdateFormOverridesProps = {
    ArtisanquoteUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Amountquoted?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ArtisanquoteUpdateFormProps = React.PropsWithChildren<{
    overrides?: ArtisanquoteUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    artisanquote?: any;
    onSubmit?: (fields: ArtisanquoteUpdateFormInputValues) => ArtisanquoteUpdateFormInputValues;
    onSuccess?: (fields: ArtisanquoteUpdateFormInputValues) => void;
    onError?: (fields: ArtisanquoteUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ArtisanquoteUpdateFormInputValues) => ArtisanquoteUpdateFormInputValues;
    onValidate?: ArtisanquoteUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ArtisanquoteUpdateForm(props: ArtisanquoteUpdateFormProps): React.ReactElement;
