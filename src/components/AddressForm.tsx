import { AddressElement } from "@stripe/react-stripe-js";


const AddressForm = () => { // Formulario que recoge detalles de la dirección del pagador
    return (
        <form>
            <h3>Address</h3>
            <AddressElement
                options={{ mode: "shipping" }}
                onChange={(event) => {
                    if (event.complete) {
                        const address = event.value.address;
                    }
                }}
            />
        </form>
    );
};

export default AddressForm;