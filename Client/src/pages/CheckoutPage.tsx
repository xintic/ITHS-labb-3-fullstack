import { useCartStore } from '@/stores/cartStore';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getTransformedImageUrl } from '@/utils/cloudinary';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FieldName = 'cardName' | 'cardNumber' | 'expiry' | 'cvv' | 'swishNumber' | 'email' | 'zip';

const fieldPlaceholders: Record<FieldName, string> = {
  cardName: 'Förnamn Efternamn',
  cardNumber: 'XXXX XXXX XXXX XXXX',
  expiry: 'MM/ÅÅ',
  cvv: '3 siffror',
  swishNumber: '0701234567',
  email: 'din@mail.se',
  zip: '123 45'
};

const paymentIcons = {
  card: '/icons/card.webp',
  swish: '/icons/swish.webp',
  invoice: '/icons/klarna.webp'
};

const shippingIcons = {
  budbee: '/icons/budbee.webp',
  best: '/icons/best.webp',
  airmee: '/icons/airmee.webp',
  postnord_ombud: '/icons/postnord.webp',
  postnord_home: '/icons/postnord.webp'
};

const shippingOptions = [
  {
    key: 'budbee',
    name: 'Budbee Hemleverans kl. 16:00-22:30',
    desc: 'Smidig leverans med fossilfritt och förnybart bränsle till din dörr, på eftermiddagen och kvällen.',
    price: 59
  },
  {
    key: 'best',
    name: 'Best Transport Hemleverans kl. 17-22',
    desc: 'Paketet körs hem till dig av BEST utan kvittens, du behöver inte vara hemma. Följ leveransen direkt i mobilen.',
    price: 59
  },
  {
    key: 'airmee',
    name: 'Airmee Hemleverans kl. 17-22',
    desc: 'Följ din leverans i realtid i mobilen. Välj själv om paketet ska lämnas utanför dörren. Leveransen är klimatkompenserad.',
    price: 69
  },
  {
    key: 'postnord_ombud',
    name: 'Postnord Ombud',
    desc: 'Paketet levereras till det PostNord-ombud eller Paketbox du valt. Du aviseras via PostNord App och via sms/email.',
    price: 49
  },
  {
    key: 'postnord_home',
    name: 'Postnord Hemleverans kl. 9-17 eller 17-22',
    desc: 'Paketet levereras till ditt hem och ställs utanför. Du aviseras via PostNord App och via sms/email och har möjlighet att byta leveransdag. Paket som väger mer än 20 kg levereras till tomtgräns och signatur behövs.',
    price: 79
  }
] as const;

const CheckoutPage = () => {
  const { items: cartItems, clearCart } = useCartStore();
  const [openSection, setOpenSection] = useState<'cart' | 'shipping' | 'payment'>('cart');
  const [shippingMethod, setShippingMethod] = useState<
    'budbee' | 'best' | 'airmee' | 'postnord_ombud' | 'postnord_home'
  >('postnord_ombud');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'swish' | 'invoice'>('card');

  const [formData, setFormData] = useState<Record<FieldName, string>>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    swishNumber: '',
    email: '',
    zip: ''
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isCartEmpty = cartItems.length === 0;

  const goTo = (step: typeof openSection) => setOpenSection(step);

  useEffect(() => {
    if (cartItems.length === 0 && openSection !== 'cart') {
      setOpenSection('cart');
    }
  }, [cartItems, openSection]);

  const handleInputChange = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field: FieldName, value: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!value.trim()) {
        newErrors[field] = 'Fältet är obligatoriskt';
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const validateAll = () => {
    const fieldsToCheck: FieldName[] =
      paymentMethod === 'card'
        ? ['cardName', 'cardNumber', 'expiry', 'cvv']
        : paymentMethod === 'swish'
          ? ['swishNumber']
          : ['email', 'zip'];
    let valid = true;
    const newErrors: Partial<Record<FieldName, string>> = {};
    for (const field of fieldsToCheck) {
      const value = formData[field];
      if (!value.trim()) {
        newErrors[field] = 'Fältet är obligatoriskt';
        valid = false;
      }
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const handleCheckout = async () => {
    if (!validateAll()) return;
    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.price
        })),
        shipping_method: shippingMethod,
        payment_method: paymentMethod
      };
      const res = await axios.post('/api/orders', payload, { withCredentials: true });
      const orderId = res.data.order_id;
      clearCart();
      navigate(`/order/${orderId}`, { replace: true });
    } catch (error) {
      console.error('Fel vid slutför köp:', error);
      alert('Något gick fel. Försök igen senare.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border rounded-md">
        <div
          className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
          onClick={() => goTo('cart')}
        >
          <h2 className="text-xl font-bold">Din varukorg</h2>
          {openSection === 'cart' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'cart' && (
          <div className="p-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">Varukorgen är tom.</p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 border-b py-2">
                    <img
                      src={getTransformedImageUrl(item.imageUrl, 'w_100,h_100,c_fill')}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.price} kr
                      </p>
                    </div>
                    <p className="font-semibold">{item.quantity * item.price} kr</p>
                  </div>
                ))}
                <div className="text-right font-bold text-lg">Totalt: {total} kr</div>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => goTo('shipping')} disabled={cartItems.length === 0}>
                    Gå vidare till leverans
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <div
          className={`flex justify-between items-center p-4 ${
            isCartEmpty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 cursor-pointer'
          }`}
          onClick={() => {
            if (!isCartEmpty) goTo('shipping');
          }}
        >
          <h2 className="text-xl font-bold">Välj leveransalternativ</h2>
          {openSection === 'shipping' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'shipping' && (
          <div className="p-4 space-y-6">
            {shippingOptions.map((option) => {
              const isFree = total >= 799;
              const displayPrice = isFree ? 0 : option.price;
              const isSelected = shippingMethod === option.key;
              const isHomeDelivery = ['budbee', 'best', 'airmee', 'postnord_home'].includes(
                option.key
              );
              return (
                <div key={option.key} className="border rounded-md p-4 space-y-2">
                  <label className="flex justify-between items-center cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-medium flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          checked={isSelected}
                          onChange={() => setShippingMethod(option.key)}
                          className="mr-2"
                        />
                        {option.name}
                      </span>
                      {isSelected && (
                        <span className="text-sm text-muted-foreground ml-6 mt-1">
                          {option.desc}
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm font-medium whitespace-nowrap">
                      <img
                        src={shippingIcons[option.key]}
                        alt={option.name}
                        className="h-6 object-contain mb-1 ml-auto"
                      />
                      <span>{displayPrice === 0 ? '0 kr' : `${displayPrice} kr`}</span>
                    </div>
                  </label>
                  {isSelected && option.key === 'postnord_ombud' && (
                    <div className="bg-green-100 rounded-md p-3 text-sm mt-2">
                      <p className="font-semibold">
                        Hemköp Hamnen, Odelbergs Väg 1, 13446 GUSTAVSBERG
                      </p>
                      <p>Odelbergs Väg 1</p>
                      <p>(900 m)</p>
                      <Button variant="outline" className="mt-2 w-full">
                        Ändra utlämningsställe
                      </Button>
                    </div>
                  )}
                  {isSelected && isHomeDelivery && (
                    <div className="mt-3">
                      <Label htmlFor={`code-${option.key}`} className="pb-2 block">
                        Portkod (valfritt)
                      </Label>
                      <Input id={`code-${option.key}`} type="text" placeholder="1234" />
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => goTo('cart')}>
                Tillbaka till varukorg
              </Button>
              <Button onClick={() => goTo('payment')}>Gå vidare till betalning</Button>
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <div
          className={`flex justify-between items-center p-4 ${
            isCartEmpty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 cursor-pointer'
          }`}
          onClick={() => {
            if (!isCartEmpty) goTo('payment');
          }}
        >
          <h2 className="text-xl font-bold">Välj betalningsmetod</h2>
          {openSection === 'payment' ? <LuChevronUp /> : <LuChevronDown />}
        </div>
        {openSection === 'payment' && (
          <div className="p-4 space-y-6">
            {(['card', 'swish', 'invoice'] as const).map((method) => (
              <div key={method} className="border rounded-md p-4 space-y-4">
                <label className="flex justify-between items-center cursor-pointer">
                  <span className="font-medium">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mr-2"
                    />
                    {method === 'card' && 'Kortbetalning'}
                    {method === 'swish' && 'Swish'}
                    {method === 'invoice' && 'Faktura'}
                  </span>
                  <img src={paymentIcons[method]} alt={method} className="h-6 object-contain" />
                </label>
                {paymentMethod === method && (
                  <div className="mt-4 space-y-4">
                    {method === 'card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['cardName', 'cardNumber', 'expiry', 'cvv'] as FieldName[]).map(
                          (field) => (
                            <div key={field}>
                              <Label htmlFor={field} className="pb-2 capitalize">
                                {field === 'cardName'
                                  ? 'Kortinnehavare'
                                  : field === 'cardNumber'
                                    ? 'Kortnummer'
                                    : field === 'expiry'
                                      ? 'Utgångsdatum'
                                      : 'CVC / CVV'}
                              </Label>
                              <Input
                                id={field}
                                type="text"
                                placeholder={fieldPlaceholders[field]}
                                value={formData[field]}
                                onChange={(e) => handleInputChange(field, e.target.value)}
                                autoComplete="off"
                              />
                              {errors[field] && (
                                <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {method === 'swish' && (
                      <div>
                        <Label htmlFor="swishNumber" className="pb-2 block">
                          Mobilnummer
                        </Label>
                        <Input
                          id="swishNumber"
                          type="tel"
                          placeholder={fieldPlaceholders['swishNumber']}
                          value={formData.swishNumber}
                          onChange={(e) => handleInputChange('swishNumber', e.target.value)}
                          autoComplete="off"
                        />
                        {errors.swishNumber && (
                          <p className="text-sm text-red-600 mt-1">{errors.swishNumber}</p>
                        )}
                      </div>
                    )}
                    {method === 'invoice' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country" className="pb-2 block">
                            Land / Region
                          </Label>
                          <Select defaultValue="SE">
                            <SelectTrigger id="country" className="w-full">
                              <SelectValue placeholder="Välj land" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SE">Sverige</SelectItem>
                              <SelectItem value="NO">Norge</SelectItem>
                              <SelectItem value="FI">Finland</SelectItem>
                              <SelectItem value="DK">Danmark</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type" className="pb-2 block">
                            Handlar som
                          </Label>
                          <Select defaultValue="private">
                            <SelectTrigger id="type" className="w-full">
                              <SelectValue placeholder="Välj typ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Privatperson</SelectItem>
                              <SelectItem value="business">Företag</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="email" className="pb-2 block">
                            Mailadress
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={fieldPlaceholders['email']}
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            autoComplete="off"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="zip" className="pb-2 block">
                            Postnummer
                          </Label>
                          <Input
                            id="zip"
                            type="text"
                            placeholder={fieldPlaceholders['zip']}
                            value={formData.zip}
                            onChange={(e) => handleInputChange('zip', e.target.value)}
                            autoComplete="off"
                          />
                          {errors.zip && <p className="text-sm text-red-600 mt-1">{errors.zip}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => goTo('shipping')}>
                Tillbaka till leverans
              </Button>
              <Button onClick={handleCheckout} disabled={!paymentMethod}>
                Slutför köp
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
