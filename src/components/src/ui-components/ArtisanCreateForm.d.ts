/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { AutocompleteProps, GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ArtisanCreateFormInputValues = {
    Companyname?: string;
    Companyaddress?: string;
    Companypostcode?: string;
    isactive?: boolean;
    phone?: string;
    email?: string;
    interestedinMale?: boolean;
    interestedinfemale?: boolean;
    interestedinallgender?: boolean;
    interestedinrings?: boolean;
    interestedinnecklaces?: boolean;
    interestedinbraclets?: boolean;
    interestedinearrings?: boolean;
    interestedinchains?: boolean;
    interestedincufflinks?: boolean;
    interstedinaljewellrytypes?: boolean;
    agreedtoterms?: boolean;
    ipaddress?: string;
    Country?: string;
    Currency?: string;
    agreedtimestamp?: string;
    Contacts?: any[];
};
export declare type ArtisanCreateFormValidationValues = {
    Companyname?: ValidationFunction<string>;
    Companyaddress?: ValidationFunction<string>;
    Companypostcode?: ValidationFunction<string>;
    isactive?: ValidationFunction<boolean>;
    phone?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    interestedinMale?: ValidationFunction<boolean>;
    interestedinfemale?: ValidationFunction<boolean>;
    interestedinallgender?: ValidationFunction<boolean>;
    interestedinrings?: ValidationFunction<boolean>;
    interestedinnecklaces?: ValidationFunction<boolean>;
    interestedinbraclets?: ValidationFunction<boolean>;
    interestedinearrings?: ValidationFunction<boolean>;
    interestedinchains?: ValidationFunction<boolean>;
    interestedincufflinks?: ValidationFunction<boolean>;
    interstedinaljewellrytypes?: ValidationFunction<boolean>;
    agreedtoterms?: ValidationFunction<boolean>;
    ipaddress?: ValidationFunction<string>;
    Country?: ValidationFunction<string>;
    Currency?: ValidationFunction<string>;
    agreedtimestamp?: ValidationFunction<string>;
    Contacts?: ValidationFunction<any>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ArtisanCreateFormOverridesProps = {
    ArtisanCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    Companyname?: PrimitiveOverrideProps<TextFieldProps>;
    Companyaddress?: PrimitiveOverrideProps<TextFieldProps>;
    Companypostcode?: PrimitiveOverrideProps<TextFieldProps>;
    isactive?: PrimitiveOverrideProps<SwitchFieldProps>;
    phone?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    interestedinMale?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinfemale?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinallgender?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinrings?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinnecklaces?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinbraclets?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinearrings?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedinchains?: PrimitiveOverrideProps<SwitchFieldProps>;
    interestedincufflinks?: PrimitiveOverrideProps<SwitchFieldProps>;
    interstedinaljewellrytypes?: PrimitiveOverrideProps<SwitchFieldProps>;
    agreedtoterms?: PrimitiveOverrideProps<SwitchFieldProps>;
    ipaddress?: PrimitiveOverrideProps<TextFieldProps>;
    Country?: PrimitiveOverrideProps<TextFieldProps>;
    Currency?: PrimitiveOverrideProps<TextFieldProps>;
    agreedtimestamp?: PrimitiveOverrideProps<TextFieldProps>;
    Contacts?: PrimitiveOverrideProps<AutocompleteProps>;
} & EscapeHatchProps;
export declare type ArtisanCreateFormProps = React.PropsWithChildren<{
    overrides?: ArtisanCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ArtisanCreateFormInputValues) => ArtisanCreateFormInputValues;
    onSuccess?: (fields: ArtisanCreateFormInputValues) => void;
    onError?: (fields: ArtisanCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ArtisanCreateFormInputValues) => ArtisanCreateFormInputValues;
    onValidate?: ArtisanCreateFormValidationValues;
} & React.CSSProperties>;
export default function ArtisanCreateForm(props: ArtisanCreateFormProps): React.ReactElement;
