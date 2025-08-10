
class Trampolin {

    calculateFixedGroupPrice(weather: number, bookingDistance: number, season: number): number {
        const basePrice: number = 150

        let finalPrice: number = basePrice * weather * bookingDistance * season

        return finalPrice
    }

    calculateSinglePersonPrice(weather: number, bookingDistance: number, season: number): number {
        const basePrice: number = 50

        let finalPrice: number = basePrice * weather * bookingDistance * season

        return finalPrice
    }

    calculateVariableGroupPrice(weather: number, bookingDistance: number, season: number, additionalPeople: number = 0): number {
        const basePrice: number = 150
        const additionalPrice: number = 40

        let priceVariables: number = weather * bookingDistance * season
        let additionalPeopleTotal: number = additionalPeople * additionalPrice
        let fixedPrices: number = basePrice + additionalPeopleTotal

        let finalPrice: number = priceVariables * fixedPrices

        return finalPrice
}

}

class RioTennis {

    calculateSinglePersonPrice(weather: number, bookingDistance: number, season: number): number {
        const basePrice: number = 40

        let finalPrice: number = basePrice * weather * bookingDistance * season

        return finalPrice
    }


    calculateVariableGroupPrice(weather: number, bookingDistance: number, season: number, additionalPeople: number = 0): number {
        const basePrice: number = 25
        const additionalPrice: number = 30

        let priceVariables: number = weather * bookingDistance * season
        let additionalPeopleTotal: number = additionalPeople * additionalPrice
        let fixedPrices: number = basePrice + additionalPeopleTotal

        let finalPrice: number = priceVariables * fixedPrices

        return finalPrice
}

}

class Rooftop {
    calculateSinglePersonPrice(weather: number, bookingDistance: number, season: number): number {
        const basePrice: number = 60

        let finalPrice: number = basePrice * weather * bookingDistance * season

        return finalPrice
    }
}

class Football {

    calculateVariableGroupPrice(weather: number, bookingDistance: number, season: number, peopleTotal: number): number {
        const basePrice: number = 100 * peopleTotal

        let priceVariables: number = weather * bookingDistance * season

        let finalPrice: number = priceVariables * basePrice

        return finalPrice
    }


}

class SaoPauloTennis {
    calculateVariableGroupPrice(weather: number, bookingDistance: number, season: number, peopleTotal: number): number {
        const basePrice: number = 100 * peopleTotal

        let priceVariables: number = weather * bookingDistance * season

        let finalPrice: number = priceVariables * basePrice

        return finalPrice
    }

}

class Drinks {
       calculateSinglePersonPrice(weather: number, bookingDistance: number, season: number): number {
        const basePrice: number = 200

        let finalPrice: number = basePrice * weather * bookingDistance * season

        return finalPrice
    }
}

class PadelTennis {

       calculateVariableGroupPrice(weather: number, bookingDistance: number, season: number, adultAmount: number, childrenAmount: number): number {
        const basePriceAdult: number = 50
        const basePriceChild: number = 30

        let priceVariables: number = weather * bookingDistance * season


            if (childrenAmount === 0) {
                let priceNoChildren: number = basePriceAdult * childrenAmount
                let finalPriceNoChildren: number = priceNoChildren * priceVariables

                return finalPriceNoChildren
            }

            if (adultAmount === 0) {
                let priceNoAdults: number = basePriceChild * childrenAmount
                let finalPriceNoAdults: number = priceNoAdults * priceVariables

                return finalPriceNoAdults
            }


        let priceChildren: number = basePriceChild * childrenAmount
        let priceAdult: number = basePriceAdult *  adultAmount
        let fixedPrices: number = priceChildren + priceAdult

        let finalPrice: number = fixedPrices * priceVariables

        return finalPrice
}

}
