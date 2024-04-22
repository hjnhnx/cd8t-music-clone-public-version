<template>
  <div id="paypal-button-container"></div>
</template>
<script setup>
import { loadScript } from "@paypal/paypal-js";
import { onMounted } from "vue";
import { PackageService } from "@/services/package";
import { StarPointService } from "@/services/star-point";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  reference: Object,
  packageId: String,
  packagePrice: String,
  userId: String,
});

onMounted(async () => {
  const paypalSdk = await loadScript({
    "client-id": "AW5Z-eCo0GKqVoN2B9FQkn0MZEiTE4pBYaiwEv2LDw2UmR_79pCAE0qIrcsn4Pgc1q6zm2IBgy3hNbtj",
    currency: "USD",
    locale: "en_VN",
    "data-page-type": "checkout",
  });

  await paypalSdk
    .Buttons({
      createOrder: function (data, actions) {
        const price = ((parseInt(props.packagePrice) + parseInt(props.packagePrice) * 0.08) / 23450)
          .toFixed(2)
          .toString();
        return actions.order.create({
          purchase_units: [
            {
              reference_id: "store_mobile_world_order_1234",
              amount: {
                value: price,
                currency: "USD",
              },
            },
          ],
          payer: {
            name: {
              given_name: "Test",
              surname: "test",
            },
          },
          application_context: {
            brand_name: "APP Music",
          },
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (orderData) {
          const data = {
            userId: props.userId,
            packageId: props.packageId,
          };
          try {
            if (orderData.status === "COMPLETED") {
              if (data.packageId != 0) {
                PackageService.access(data);
                router.push({ name: "success" });
              } else {
                const price = parseInt(props.packagePrice);
                const data = {
                  point: price / 5,
                  userId: props.userId,
                };
                StarPointService.recharge(data);
                router.push({ name: "success" });
              }
            }
          } catch (e) {
            alert("There was an error, please try again");
            return;
          }
        });
      },
    })
    .render("#paypal-button-container");
});
</script>
