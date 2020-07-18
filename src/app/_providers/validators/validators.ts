import { AbstractControl } from '@angular/forms';
import { Shop } from 'src/app/_models/shop';

export function passwordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let password = control.value;
        // let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        let strongRegex = new RegExp("^((?!.*[\\s])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}))");

        let isStrong = strongRegex.test(password);
        if (!isStrong) {
            return { weak: true };
        }
        return null;
    }
}

export function confirmPasswordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        const confirmPass = control.value;
        const passControl = control.root.get('password');
        if (passControl) {
            const pass = passControl.value;
            if (pass !== confirmPass) {
                return {
                    notmatch: true
                };
            }
        }
        return null;
    }
}

export function confirmConfirmPasswordValidator(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        const passControl = control.value;
        const confirmPass = control.root.get('confirmPassword');
        if(confirmPass && (confirmPass != null || confirmPass != undefined)){
            if (confirmPass.value && (confirmPass.value != null || confirmPass.value != undefined)) {
                if(passControl !== confirmPass.value){
                    //reset confirm password value
                    control.root.get('confirmPassword').setValue('');
                    return null;
                }
            }
        }
        return null;
    }
}

export function checkNoWhiteSpace(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let value = control.value;
        let strongRegex = new RegExp('\\S');

        let whiteSpace = strongRegex.test(value);
        if (!whiteSpace) {
            return { hasWhiteSpace: true };
        }
        return null;
    }
}

export function checkValidPhone(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let value = control.value;

        let valueRegex = new RegExp('^((254[0-9]{9})|(07[0-9]{8}))$');

        let regMatches = valueRegex.test(value);
        if (!regMatches) {
            return { invalidPhone: true };
        }
        return null;
    }
}

export function checkValidPhoneNumber(value: any) {
    if (value && (value != null || value != undefined)) {
        let valueRegex = new RegExp('^((254[0-9]{9})|(07[0-9]{8}))$');
        let regMatches = valueRegex.test(value);
        return { validPhone: regMatches };
    }
}

export function checkValidNumberic(value: any) {
    if (value && (value != null || value != undefined)) {
        let valueRegex = new RegExp('^-?(0|[1-9]\\d*)?$');
        let regMatches = valueRegex.test(value);
        return { validNumeric: regMatches };
    }
}

export function checkAmount(control: AbstractControl) {
    if (control && (control.value != null || control.value != undefined)) {
        let value = control.value;
        let valueRegex = new RegExp('^-?([0-9]|([0-9]\\d*)\.?([0-9]\\d*))?$');

        let regMatches = valueRegex.test(value);
        if (!regMatches) {
            return { invalidAmount: true };
        }
        return null;
    }
}

export function hasRoleForShop(userRoles: any[], roleId: number, shopId: number): boolean {
    if(userRoles == undefined || userRoles == null || userRoles.length == 0) {
        return false;
    }
    return rolesForShop(userRoles, shopId).includes(roleId);
}

export function rolesForShop(userRoles: any[], shopId: number): any[] {
    let roles: number [] = [];
    userRoles.forEach(role => {
        if(role.shop_id == shopId){
            roles.push(role.id);
            roles.slice();
        }
    });
    return roles;
}

export function getShopByShopNo(userShops: any[], shopNumber: string): any {
    let shop: Shop = null;
    if(userShops == undefined || userShops == null || userShops.length == 0) {
        return shop;
    }
    userShops.forEach(s => {
        if(s.shop_number == shopNumber){
            shop = {id: s.id, is_open: s.is_open, user_id: s.user_id, shop_number: s.shop_number, shop_name: s.shop_name, shop_location: s.shop_location, phone_number: s.phone_number, latitude: s.latitude, longitude: s.longitude}
        }
    });
    return shop;    
}