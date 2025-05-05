using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using project_alpha_0._1.osztalyok;
using Org.BouncyCastle.Asn1.X509;
using System.Windows.Forms;
using System.Drawing;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.ListView;
using System.Xml.Linq;

namespace project_alpha_0._1.osztalyok
{
    internal class HttpRequestek
    {
        HttpClient client = new HttpClient();

        public HttpRequestek()
        {
            try
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenValasz.Token);
            }
            catch (Exception e)
            {
                MessageBox.Show("Hiba történt a token beállításakor: " + e.Message);
            }
        }

        //Login

        public async Task<string> postLogin(string username, string password)
        {
            string url = "http://127.1.1.1:3000/loginAdmin";
            userData message = new userData();
            try
            {
                var JsonData = new
                {
                    loginUser = username,
                    loginPassword = password,
                    role = 2
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<userData>(result);
                TokenValasz.Token = message.token;
                //MessageBox.Show(message.token);
                //MessageBox.Show(TokenValasz.Token);
                //MessageBox.Show(message.message);
                if (!response.IsSuccessStatusCode)
                {
                    // Írjuk ki, melyik státuszkód és az esetleges hibaüzenet a válaszból
                    //MessageBox.Show($"Hiba: {response.StatusCode}\nVálasz: {result}");
                    return "Hiba történt a bejelentkezés során!";
                }

                return "Sikeres bejelentkezés, shalom!";
            }
            catch (Exception e)
            {
                if (message == null)
                {
                    MessageBox.Show(e.Message);
                }
                else
                {
                    MessageBox.Show(message.message);
                }
                return "Hiba történt a bejelentkezés során!";
            }

        }

        //user routes

        public async Task<List<UserProfile>> getUserProfiles()
        {
            string url = "http://127.1.1.1:3000/profileAdmin";
            List<UserProfile> userList = new List<UserProfile>();

            try
            {

                string response = await client.GetStringAsync(url);
                userList = JsonConvert.DeserializeObject<List<UserProfile>>(response);

                return userList;
            }
            catch (Exception e)
            {

                MessageBox.Show("Tyű valami nemjo " + e.Message);
                return userList;
            }
        }

        public async Task<string> putProfileDataUpdate(int id, string uName, string pName, string uPass, string uEmail, int uPhone)
        {
            string url = "http://127.1.1.1:3000/profileDataUpdateAdmin/" + id;
            userData message = null;

            try
            {
                var JsonData = new
                {
                    username = uName,
                    name = pName,
                    email = uEmail,
                    phone_num = uPhone,
                    password = uPass
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                HttpResponseMessage response = await client.PutAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<userData>(result);

                int currentUserId = message.id;

                if (id == currentUserId)
                {
                    TokenValasz.Token = message.token;
                }
                response.EnsureSuccessStatusCode();
                return "Adatok sikeresen frissítve!";
            }
            catch (Exception e)
            {
                if (message == null)
                {
                    MessageBox.Show(e.Message);
                }
                else
                {
                    MessageBox.Show(message.message);
                }
                return "Hiba történt az adatok frissítése során!";
            }
        }

        public async Task<bool> deleteUserProfile(int id)
        {
            string url = "http://127.1.1.1:3000/userProfileDeleteAdmin/" + id;
            userData message = null;

            try
            {
                HttpResponseMessage response = await client.DeleteAsync(url);
                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<userData>(result);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception e)
            {
                if (message == null)
                {
                    MessageBox.Show(e.Message);
                }
                else
                {
                    MessageBox.Show(message.message);
                }
                return false;
            }
            return true;
        }


        public async Task<bool> postRegisterUsers(string uUname, string pass, string uEmail, int uRole, string uName, int phone)
        {
            string url = "http://127.1.1.1:3000/registerUser";
            userData message = null;
            try
            {

                var JsonData = new
                {
                    registerUser = uUname,
                    registerPassword = pass,
                    registerEmail = uEmail,
                    registerRole = uRole,
                    registerName = uName,
                    registerPhone = phone
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<userData>(result);
                response.EnsureSuccessStatusCode();

            }
            catch (Exception e)
            {
                if (message == null)
                {
                    MessageBox.Show(e.Message);
                }
                else
                {
                    MessageBox.Show(message.message);
                }
                return false;
            }

            return true;
        }




        //reservation routes

        public async Task<List<Reservations>> getReservations()
        {
            string url = "http://127.1.1.1:3000/reservationAdmin";
            List<Reservations> reservationList = new List<Reservations>();

            try
            {

                string response = await client.GetStringAsync(url);
                reservationList = JsonConvert.DeserializeObject<List<Reservations>>(response);

                return reservationList;
            }
            catch (Exception e)
            {

                MessageBox.Show("Tyű valami nemjo " + e.Message);
                return reservationList;
            }
        }


        public async Task<bool> putUpdateReservation(int id, bool uActive, int uSum, int uReservation_owner_id, int uPark_slot, int uParkhouse_id)
        {
            string url = "http://127.1.1.1:3000/reservationUpdateAdmin/" + id;
            Reservations message = null;

            try
            {
                var JsonData = new
                {
                    active = uActive,
                    sum = uSum,
                    reservation_owner_id = uReservation_owner_id,
                    park_slot = uPark_slot,
                    parkhouse_id = uParkhouse_id
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                HttpResponseMessage response = await client.PutAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Reservations>(result);


                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }
        }

        public async Task<bool> deleteReservation(int id)
        {
            string url = "http://127.1.1.1:3000/reservationDeleteAdmin/" + id;
            Reservations message = null;

            try
            {
                HttpResponseMessage response = await client.DeleteAsync(url);
                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Reservations>(result);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }
            return true;
        }


        public async Task<bool> postReservation(DateTime uStartTime, int uResTime, int uResOwnId, int uSlotId, int uParkhouseId)
        {
            string url = "http://127.1.1.1:3000/registerReservationAdmin";
            Reservations message = null;
            try
            {

                var JsonData = new
                {
                    start_time = uStartTime,
                    resTime = uResTime,
                    resOwnId = uResOwnId,
                    slotId = uSlotId,
                    parkhouseId = uParkhouseId
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Reservations>(result);
                response.EnsureSuccessStatusCode();

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }

            return true;
        }



        //parkhouse routes

        public async Task<List<Parkhouses>> getParkhouses()
        {
            string url = "http://127.1.1.1:3000/parkhouseAdmin";
            List<Parkhouses> parkhouseList = new List<Parkhouses>();

            try
            {
                string response = await client.GetStringAsync(url);
                parkhouseList = JsonConvert.DeserializeObject<List<Parkhouses>>(response);

                return parkhouseList;
            }
            catch (Exception e)
            {

                MessageBox.Show("Tyű valami nemjo " + e.Message);
                return parkhouseList;
            }
        }

        public async Task<bool> putUpdateParkhouses(int id, string uName, int uCapacity, string uAddress, DateTime uOpening, DateTime uClosing)
        {
            string url = "http://127.1.1.1:3000/parkhousesUpdateAdmin/" + id;
            Parkhouses message = null;

            try
            {
                var JsonData = new
                {
                    name = uName,
                    capacity = uCapacity,
                    address = uAddress,
                    opening = uOpening,
                    closing = uClosing
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "Application/JSON");
                HttpResponseMessage response = await client.PutAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Parkhouses>(result);


                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }
        }

        public async Task<bool> deleteParkhouses(int id)
        {
            string url = "http://127.1.1.1:3000/parkhouseDeleteAdmin/" + id;
            Parkhouses message = null;

            try
            {
                HttpResponseMessage response = await client.DeleteAsync(url);
                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Parkhouses>(result);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }
            return true;
        }

        public async Task<bool> postParkhouses(string name, int cap, string address, DateTime opening, DateTime closing, int carheight, int maxstaytime)
        {
            string url = "http://127.1.1.1:3000/registerParkhouseAdmin";
            Parkhouses message = null;
            try
            {

                var JsonData = new
                {
                    pName = name,
                    pCapacity = cap,
                    add = address,
                    open = opening,
                    close = closing,
                    cHeight = carheight,
                    maxstay = maxstaytime
                };

                string jsonString = JsonConvert.SerializeObject(JsonData);
                StringContent sendThis = new StringContent(jsonString, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(url, sendThis);

                string result = await response.Content.ReadAsStringAsync();
                message = JsonConvert.DeserializeObject<Parkhouses>(result);
                response.EnsureSuccessStatusCode();

            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message);
                return false;
            }

            return true;
        }
    }
}
