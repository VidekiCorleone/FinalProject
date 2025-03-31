using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using Newtonsoft.Json;
using project_alpha_0._1.osztalyok;

namespace project_alpha_0._1
{
    public partial class signIn : Form
    {
        private readonly HttpClient _httpClient;

        public signIn()
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://127.1.1.1:3000/login");
            Start();
            button1.Click += closeFunc;
            button2.Click += signInFunc;


            // enter gomb = bejelentkezés
            this.KeyPreview = true;
            this.KeyDown += Form1_KeyDown;
        }

        public void Start()
        {
            button1.Text = "Bezárás";
            button2.Text = "Bejelentkezés";
            label1.Text = "Bejelentkezés";
            label2.Text = "Felhasználónév:";
            label3.Text = "Jelszó:";

            textBox2.PasswordChar = '∗';

            int label1Middle = label1.Width / 2;
            label1.Left = this.Width / 2 - label1Middle;

            button1.Left = this.Width / 2 - (button1.Width + 40);
            button2.Left = this.Width / 2 + 40;

            this.FormBorderStyle = FormBorderStyle.None;

            //Image kiskocsi = Image.FromFile("kiskocsi.png");
        }

        public async void signInFunc(object s, EventArgs e)
        {
            /*var user = textBox1.Text.ToLower();
            var pass = textBox2.Text.ToLower();*/



            try
            {
                // Várakozási állapot jelzése
                button2.Enabled = false;
                button2.Text = "Bejelentkezés...";

                string felhasznalonev = textBox1.Text.Trim();
                string jelszo = textBox2.Text;

                if (string.IsNullOrEmpty(felhasznalonev) || string.IsNullOrEmpty(jelszo))
                {
                    MessageBox.Show("Kérlek töltsd ki mindkét mezőt!");
                    Visszaallitas();
                    return;
                }

                BejelentkezesiAdatok bejelentkezesiAdatok = new BejelentkezesiAdatok
                {
                    uName = felhasznalonev,
                    uPass = jelszo
                };

                var tokenValasz = await Bejelentkezes(bejelentkezesiAdatok);

                if (tokenValasz != null && !string.IsNullOrEmpty(tokenValasz.Token))
                {
                    Properties.Settings.Default.Token = tokenValasz.Token;
                    Properties.Settings.Default.Save();

                    this.DialogResult = DialogResult.OK;
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Hibás felhasználónév vagy jelszó!");
                    Visszaallitas();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Váratlan hiba történt: {ex.Message}");
                Visszaallitas();
            }


            /*if (user == "admin" && pass == "admin")
            {
                this.Hide();
                Menu menu = new Menu();
                menu.ShowDialog();
            }
            else
            {
                //MessageBox.Show("Helytelen felhasználónév vagy jelszó!");
                const string message = "Helytelen felhasználónév vagy jelszó!";
                const string caption = "Helytelen adat";
                MessageBox.Show(message, caption, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }*/
        }

        private void Visszaallitas()
        {
            button2.Enabled = true;
            button2.Text = "Bejelentkezés";
        }

        public void closeFunc(object s, EventArgs e)
        {
            const string message = "Biztosan be akarod zárni?";
            const string caption = "Bezárás";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                /*this.Hide();
                Form1 form1 = new Form1();
                form1.ShowDialog();*/

                Application.Exit();
            }
        }

        private void Form1_KeyDown(object s, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                button2.PerformClick();
            }
        }

        private async Task<TokenValasz> Bejelentkezes(BejelentkezesiAdatok adatok)
        {
            try
            {
                var bejelentkezesiObjektum = new
                {
                    loginUser = adatok.uName,
                    loginPassword = adatok.uPass
                };

                var tartalom = new StringContent(
                    JsonConvert.SerializeObject(bejelentkezesiObjektum),
                    Encoding.UTF8,
                    "application/json"
                );

                var valasz = await _httpClient.PostAsync("http://127.1.1.1:3000/login", tartalom);

                if (!valasz.IsSuccessStatusCode)
                {
                    var hibaUzenet = await valasz.Content.ReadAsStringAsync();
                    MessageBox.Show($"Bejelentkezési hiba: {hibaUzenet}");
                    return null;
                }

                var tokenValaszJson = await valasz.Content.ReadAsStringAsync();

                try
                {
                    return JsonConvert.DeserializeObject<TokenValasz>(tokenValaszJson);
                }
                catch (JsonException ex)
                {
                    MessageBox.Show($"Hibás válasz formátum: {ex.Message}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hálózati hiba: {ex.Message}");
                return null;
            }
        }
    }
}
