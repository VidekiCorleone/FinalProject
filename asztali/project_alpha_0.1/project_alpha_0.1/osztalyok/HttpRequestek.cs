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
                    MessageBox.Show($"Hiba: {response.StatusCode}\nVálasz: {result}");
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

                MessageBox.Show("Tyű valami nemjo "+ e.Message);
                return userList;
            }
        }

        public async Task<string> putProfileDataUpdate(int id, string uName, string pName, string uPass, string uEmail, int uPhone)
        {
            string url = "http://127.1.1.1:3000/profileDataUpdate/" + id;
            userData message = new userData();

            try
            {
                var JsonData = new {
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
                TokenValasz.Token = message.token;
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

    }
}
